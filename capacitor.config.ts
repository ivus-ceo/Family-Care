import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
    appId: "com.ivus.us",
    appName: "ivus",
    webDir: ".output/public",
    server: {
        androidScheme: "https"
    },
    plugins: {
        PushNotifications: {
            presentationOptions: ["badge", "sound", "alert"],
        },
        LocalNotifications: {
            smallIcon: "ic_stat_icon_config_sample",
            iconColor: "#488AFF",
            sound: "beep.wav",
        },
        BackgroundRunner: {
            label: 'com.ivus.us.background.task',
            src: 'background.js',
            event: 'updateGeolocationTask',
            repeat: true,
            interval: 2,
            autoStart: false,
        },
    }
}

export default config