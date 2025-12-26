import * as signalR from '@microsoft/signalr';

/**
 * SignalR Helper - Part 4
 * Real-time notification connection
 */

let connection = null;
let reconnectTimer = null;

const HUB_URL = 'http://127.0.0.1:5150';

/**
 * SignalR bağlantısını başlatır
 */
export async function startConnection(token) {
    if (connection && connection.state === signalR.HubConnectionState.Connected) {
        return connection;
    }

    connection = new signalR.HubConnectionBuilder()
        .withUrl(`${HUB_URL}/hubs/notifications`, {
            accessTokenFactory: () => token
        })
        .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
        .configureLogging(signalR.LogLevel.Warning)
        .build();

    try {
        await connection.start();
        console.log('SignalR Connected');
        return connection;
    } catch (err) {
        console.error('SignalR Connection Error:', err);
        // Retry after 5 seconds
        reconnectTimer = setTimeout(() => startConnection(token), 5000);
        throw err;
    }
}

/**
 * SignalR bağlantısını kapatır
 */
export async function stopConnection() {
    if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
    }

    if (connection) {
        try {
            await connection.stop();
            console.log('SignalR Disconnected');
        } catch (err) {
            console.error('SignalR Stop Error:', err);
        }
        connection = null;
    }
}

/**
 * Bildirim event'ini dinler
 */
export function onNotification(callback) {
    if (connection) {
        connection.on('ReceiveNotification', callback);
    }
}

/**
 * Bildirim event listener'ını kaldırır
 */
export function offNotification(callback) {
    if (connection) {
        connection.off('ReceiveNotification', callback);
    }
}

/**
 * Sensör güncelleme event'ini dinler
 */
export function onSensorUpdate(callback) {
    if (connection) {
        connection.on('SensorUpdate', callback);
    }
}

/**
 * Sensör güncelleme event listener'ını kaldırır
 */
export function offSensorUpdate(callback) {
    if (connection) {
        connection.off('SensorUpdate', callback);
    }
}

/**
 * Bağlantı durumunu döndürür
 */
export function getConnectionState() {
    if (!connection) return 'disconnected';
    switch (connection.state) {
        case signalR.HubConnectionState.Connected:
            return 'connected';
        case signalR.HubConnectionState.Connecting:
            return 'connecting';
        case signalR.HubConnectionState.Reconnecting:
            return 'reconnecting';
        default:
            return 'disconnected';
    }
}

/**
 * Mevcut bağlantıyı döndürür
 */
export function getConnection() {
    return connection;
}
