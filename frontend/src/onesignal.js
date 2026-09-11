import OneSignal from "react-onesignal";

export async function initializeOneSignal() {

    await OneSignal.init({
        appId: import.meta.env.VITE_ONESIGNAL_APP_ID,

        allowLocalhostAsSecureOrigin: true,

        notifyButton: {
            enable: true,
        },
    });

}

export async function getOneSignalSubscriptionId() {

    const subscriptionId =
        OneSignal.User.PushSubscription.id;

    return subscriptionId;
}