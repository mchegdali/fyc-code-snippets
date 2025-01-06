/**
 * Publisher : Émetteur de messages
 *
 * Publisher découplé du broker :
 * - Permet de publier depuis n'importe où sur le réseau
 * - Peut être instancié plusieurs fois sans impact sur le système
 * - Isolation complète des autres composants
 *
 * Analogie : Journal qui :
 * - Crée du contenu (messages)
 * - Catégorise ses articles (topics)
 * - Envoie ses articles au distributeur (broker)
 * - Ne sait pas qui va lire ses articles
 */
class Publisher {
  constructor(brokerUrl = "http://localhost:3000") {
    this.brokerUrl = brokerUrl;
  }

  async publishMessage(topic, message) {
    try {
      const response = await fetch(`${this.brokerUrl}/publish/${topic}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const result = await response.json();
      console.log(`Publication sur le topic "${topic}": ${message}`);
      return result;
    } catch (error) {
      // Important pour la robustesse du système : ne pas laisser les erreurs silencieuses
      console.error("Erreur de publication:", error);
      throw error;
    }
  }
}

export default Publisher;
