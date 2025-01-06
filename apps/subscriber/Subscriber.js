import { EventSource } from "eventsource";

/**
 * Subscriber : Récepteur de messages
 *
 * - Maintient une liste de ses abonnements actifs
 * - Gère automatiquement la reconnexion en cas de perte réseau
 * - Peut s'abonner/désabonner dynamiquement sans redémarrage
 */
class Subscriber {
  /**
   *
   * @param {string} name
   * @param {string | URL} brokerUrl
   */
  constructor(name, brokerUrl = "http://localhost:3000") {
    this.brokerUrl = new URL(brokerUrl);
    this.name = name;

    // Map utilisée pour gérer facilement les abonnements multiples
    // et éviter les doublons
    this.eventSources = new Map();
  }

  subscribe(topic) {
    if (this.eventSources.has(topic)) {
      console.log(`${this.name} est déjà abonné au topic "${topic}"`);
      return;
    }

    const sourceUrl = new URL(`/subscribe/${topic}`, this.brokerUrl);
    const eventSource = new EventSource(sourceUrl);

    const openHandler = () => {
      console.log(`${this.name}: Connexion établie pour le topic "${topic}"`);
    };
    eventSource.addEventListener("open", openHandler);

    const messageHandler = (event) => {
      const data = JSON.parse(event.data);
      console.log(
        `${this.name} a reçu sur le topic "${topic}": ${data.message}`
      );
    };
    eventSource.addEventListener("message", messageHandler);

    // Gestion explicite des erreurs pour maintenir la stabilité du système
    const errorHandler = (error) => {
      console.error(`${this.name}: Erreur sur le topic "${topic}"`, error);
      if (eventSource.readyState === EventSource.CLOSED) {
        console.log(
          `${this.name}: Connexion perdue pour "${topic}", tentative de reconnexion...`
        );
        this.unsubscribe(topic);
      }
    };
    eventSource.addEventListener("error", errorHandler);

    this.eventSources.set(topic, eventSource);
    console.log(`${this.name} s'est abonné au topic "${topic}"`);
  }

  // Nettoyage propre des ressources pour éviter les fuites mémoire
  // et les connexions zombies
  unsubscribe(topic) {
    const eventSource = this.eventSources.get(topic);
    if (eventSource) {
      eventSource.close();
      this.eventSources.delete(topic);
      console.log(`${this.name} s'est désabonné du topic "${topic}"`);
    }
  }
}

export default Subscriber;
