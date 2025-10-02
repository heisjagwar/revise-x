export const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
        console.log('This browser does not support desktop notification');
        return;
    }

    if (Notification.permission === 'default') {
        await Notification.requestPermission();
    }
};

export const sendDueTopicNotification = (dueCount: number) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
        return;
    }

    const notificationTitle = 'Revision Reminder!';
    const notificationOptions = {
        body: `You have ${dueCount} topic${dueCount > 1 ? 's' : ''} due for revision today.`,
        icon: '/favicon.ico', // Optional: you can add an icon
    };

    new Notification(notificationTitle, notificationOptions);
};
