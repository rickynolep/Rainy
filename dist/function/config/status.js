import { getConfig, modifyConfig } from "../config.js";
import { client } from "../../main.js";
import { ActivityType, PresenceUpdateStatus } from "discord.js";
let activityType, statusText, displayStatus, statusUrl;
export function refreshStatus() {
    if (getConfig().activity === false) {
        displayStatus = getConfig().statusText;
        activityType = ActivityType.Custom;
    }
    else if (getConfig().activity === 'Listening') {
        displayStatus = `${getConfig().activity} to ${getConfig().statusText}`;
        activityType = ActivityType.Listening;
    }
    else if (getConfig().activity === 'Playing') {
        displayStatus = `${getConfig().activity} ${getConfig().statusText}`;
        activityType = ActivityType.Playing;
    }
    else if (getConfig().activity === 'Watching') {
        displayStatus = `${getConfig().activity} ${getConfig().statusText}`;
        activityType = ActivityType.Watching;
    }
    else if (getConfig().activity === 'Streaming') {
        displayStatus = `${getConfig().activity} ${getConfig().statusText}`;
        activityType = ActivityType.Streaming;
    }
    else if (getConfig().activity === 'Competing') {
        displayStatus = `${getConfig().activity} in ${getConfig().statusText}`;
        activityType = ActivityType.Competing;
    }
    else {
        console.warn(colorLog.yellow, '[W] Wrong activity format! The accepted status is: Listening, Streaming, Competing, Playing, and false! Fallback to false');
        modifyConfig((doc) => { doc.set('activity', false); });
        displayStatus = getConfig().statusText;
        activityType = ActivityType.Custom;
    }
    if (getConfig().activity !== false && getConfig().statusText === false) {
        console.warn(colorLog.yellow, '[W] Cannot disable statusText if activity is enabled! Disabling activity.');
        modifyConfig((doc) => { doc.set('activity', false); });
    }
    else if (getConfig().activity === false && getConfig().statusText === false) {
        client.user?.setActivity({
            name: '',
        });
    }
    else if (getConfig().statusUrl === false) {
        statusText = getConfig().statusText;
        client.user?.setActivity({
            type: activityType,
            name: statusText,
            state: statusText,
        });
    }
    else {
        statusText = getConfig().statusText;
        statusUrl = getConfig().statusUrl;
        client.user?.setActivity({
            type: activityType,
            name: statusText,
            state: statusText,
            url: statusUrl
        });
    }
    if (getConfig().activity === 'Streaming') {
        console.log(colorLog.dim, `[I] Reloaded bot status (Streaming - ${displayStatus})`);
    }
    else {
        if (getConfig().status === 'Online') {
            client.user?.setStatus(PresenceUpdateStatus.Online);
        }
        else if (getConfig().status === 'Idle') {
            client.user?.setStatus(PresenceUpdateStatus.Idle);
        }
        else if (getConfig().status === 'DoNotDisturb') {
            client.user?.setStatus(PresenceUpdateStatus.DoNotDisturb);
        }
        else if (getConfig().status === 'Invisible') {
            client.user?.setStatus(PresenceUpdateStatus.Invisible);
        }
        else {
            console.warn(colorLog.yellow, '[W] Wrong status format! The accepted status is: Online, Idle, DoNotDisturb and Invisible! Fallback to Online');
            modifyConfig((doc) => { doc.set('status', 'Online'); });
            client.user?.setStatus(PresenceUpdateStatus.Online);
        }
        console.log(colorLog.dim, `[I] Reloaded bot status (${getConfig().status} - ${displayStatus || 'No Status'})`);
    }
}
