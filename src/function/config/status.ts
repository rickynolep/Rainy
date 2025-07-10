import { client } from "../../main.js";
import { getConfig, modifyConfig } from "../config.js";
import { ActivityType, PresenceUpdateStatus, PresenceStatusData } from "discord.js";

let lastActivity: string = '';
let lastStatus: PresenceStatusData | null = null;
const statusMap: Record<string, PresenceStatusData> = {
    Online: PresenceUpdateStatus.Online,
    Idle: PresenceUpdateStatus.Idle,
    DoNotDisturb: PresenceUpdateStatus.DoNotDisturb,
    Invisible: PresenceUpdateStatus.Invisible,
};
let newActivityKey: any, presence :any, presenceStatus: PresenceStatusData = statusMap[''] ?? PresenceUpdateStatus.Online;
let firstActivity = true;
let firstPresence = true;

export async function reloadStatus() {
    const config = getConfig();
    const {
        activity,
        statusText,
        statusSubText,
        statusUrl,
        status,
        verbose
    } = config;

    let activityType: ActivityType;
    let displayText: string = typeof statusText === 'string' ? statusText : '';
    let subText: string | undefined = typeof statusSubText === 'string' ? statusSubText : undefined;

    const activityTypes: Record<string, ActivityType> = {
        Listening: ActivityType.Listening,
        Playing: ActivityType.Playing,
        Watching: ActivityType.Watching,
        Streaming: ActivityType.Streaming,
        Competing: ActivityType.Competing,
    };

    if (activity === false) {
        activityType = ActivityType.Custom;
    } else if (activityTypes[activity]) {
        activityType = activityTypes[activity];
        displayText = activity === 'Competing'
            ? `${activity} in ${statusText}`
            : activity === 'Listening'
            ? `${activity} to ${statusText}`
            : `${activity} ${statusText}`;
    } else {
        console.warn(yellow('[W] Invalid activity! Allowed: Listening, Playing, Watching, Streaming, Competing, or false. Falling back to false.'));
        modifyConfig((doc) => { doc.set('activity', false); });
        activityType = ActivityType.Custom;
    }

    if (activity !== false && !statusText) {
        console.warn(yellow('[W] Cannot disable statusText if activity is enabled! Disabling activity.'));
        modifyConfig((doc) => { doc.set('activity', false); });
        activityType = ActivityType.Custom;
    }

    presence  = {
        type: activityType,
        name: statusText || '',
    };

    if (activityType !== ActivityType.Custom) {
        if (statusSubText !== false) presence!.state = subText;
        if (statusUrl !== false && activityType === ActivityType.Streaming) presence!.url = statusUrl;
    }

    presenceStatus = statusMap[status as string]
    if (!statusMap[status]) {
        console.warn(yellow('[W] Invalid status format! Falling back to Online.'));
        await modifyConfig((doc) => { doc.set('status', 'Online') });
    }

    newActivityKey = JSON.stringify(presence);
    if (newActivityKey !== lastActivity || lastStatus !== presenceStatus) {
        if (newActivityKey !== lastActivity) {
            client.user?.setActivity(presence);
            lastActivity = newActivityKey;
        }   
        if (lastStatus !== presenceStatus) {
            client.user?.setStatus(presenceStatus);
            lastStatus = presenceStatus;
        }
        if (verbose) {console.log(dim(`[I] Bot status reloaded (${status || 'Online'} - ${displayText || 'No status'}, ${subText || 'No substatus'})`) )};
    }
}

export async function newStatus() {
    if (newActivityKey !== lastActivity || firstActivity) {
        client.user?.setActivity(presence);
        lastActivity = newActivityKey;
        firstActivity = false;
        }   
    if (lastStatus !== presenceStatus || firstPresence) {
        client.user?.setStatus(presenceStatus);
        lastStatus = presenceStatus;
        firstPresence = false;
    }
}