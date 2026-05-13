import { client as XMPPClient } from 'node-xmpp-client';

let xmppClient = null;

export async function initializeXMPP() {
  if (!process.env.XMPP_JID || !process.env.XMPP_PASSWORD || !process.env.XMPP_HOST) {
    console.log('XMPP not configured, skipping initialization');
    return;
  }

  try {
    xmppClient = new XMPPClient({
      jid: process.env.XMPP_JID,
      password: process.env.XMPP_PASSWORD,
      host: process.env.XMPP_HOST,
    });

    xmppClient.on('online', () => {
      console.log('XMPP client connected');
    });

    xmppClient.on('error', (err) => {
      console.error('XMPP error:', err);
    });

    xmppClient.on('close', () => {
      console.log('XMPP connection closed');
    });
  } catch (error) {
    console.error('Failed to initialize XMPP:', error);
  }
}

export async function sendXMPPNotification(message) {
  if (!xmppClient || !process.env.XMPP_NOTIFY_JID) {
    return;
  }

  try {
    const stanza = xmppClient.stanza.message(
      { to: process.env.XMPP_NOTIFY_JID, type: 'chat' },
      message
    );
    xmppClient.send(stanza);
  } catch (error) {
    console.error('Failed to send XMPP notification:', error);
  }
}

export function closeXMPP() {
  if (xmppClient) {
    xmppClient.end();
  }
}
