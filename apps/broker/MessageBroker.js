import { EventEmitter } from "node:events";
import express from "express";
import cors from "cors";

/**
 * Broker centralisé qui gère la distribution des messages.
 * Point unique de communication pour assurer la cohérence des messages
 * et éviter les problèmes de synchronisation entre publishers et subscribers.
 *
 * Analogie : Bureau de poste qui :
 * - Reçoit le courrier des expéditeurs (publishers)
 * - Connaît les adresses des destinataires (subscribers)
 * - Distribue le courrier au bon endroit
 */
class MessageBroker {
  constructor() {
    this.eventEmitter = new EventEmitter();
    this.app = express();

    this.app.use(express.json());
    this.app.use(cors());

    /**
     * Endpoint REST pour la publication :
     * - Choisi pour sa simplicité d'implémentation côté client
     * - Permet l'intégration facile avec n'importe quel langage/framework
     * - Stateless pour une meilleure scalabilité
     */
    this.app.post("/publish/:topic", (req, res) => {
      const { topic } = req.params;
      const { message } = req.body;
      this.publish(topic, message);
      res.json({ status: "success", topic, message });
    });

    /**
     * Endpoint SSE pour les abonnements :
     * - Utilisé au lieu de WebSocket pour sa simplicité et son support natif
     * - Unidirectionnel : parfait pour notre cas d'usage de diffusion
     * - Reconnexion automatique gérée par le navigateur
     * - Pas besoin de bibliothèque côté client
     */
    this.app.get("/subscribe/:topic", (req, res) => {
      const { topic } = req.params;

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const callback = (message) => {
        res.write(`data: ${JSON.stringify({ topic, message })}\n\n`);
      };

      this.subscribe(topic, callback);

      // Nécessaire pour éviter les fuites mémoire et les messages fantômes
      req.on("close", () => {
        this.unsubscribe(topic, callback);
      });
    });
  }

  /**
   * Diffuse un message à tous les subscribers d'un topic
   *
   * Le broker agit comme un amplificateur :
   * - Reçoit un message unique
   * - Le duplique pour chaque subscriber
   * - Garantit que tous les subscribers actifs reçoivent le message
   *
   * @param {string} topic - Catégorie du message
   * @param {any} message - Contenu à diffuser aux subscribers
   */
  publish(topic, message) {
    this.eventEmitter.emit(topic, message);
  }

  /**
   * Enregistre un nouveau subscriber pour un topic
   *
   * Le broker agit comme un standard téléphonique :
   * - Garde en mémoire qui veut recevoir quoi
   * - Établit le "câblage virtuel" entre la source et le destinataire
   * - Permet à plusieurs subscribers d'écouter le même topic
   *
   * @param {string} topic - Topic auquel s'abonner
   * @param {Function} callback - Fonction à appeler lors de la réception d'un message
   */
  subscribe(topic, callback) {
    this.eventEmitter.on(topic, callback);
  }

  /**
   * Retire un subscriber d'un topic
   *
   * Important pour :
   * - Éviter les fuites mémoire
   * - Ne pas envoyer des messages à des subscribers inactifs
   * - Libérer les ressources système
   *
   * @param {string} topic - Topic duquel se désabonner
   * @param {Function} callback - Fonction de callback à retirer
   */
  unsubscribe(topic, callback) {
    this.eventEmitter.removeListener(topic, callback);
  }

  listen(port = 3000) {
    this.app.listen(port, () => {
      console.log(`Broker actif sur http://localhost:${port}`);
    });
  }
}

export default MessageBroker;
