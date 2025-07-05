import { getConfig, modifyConfig } from "../config.js";
import { client } from "../../main.js";
import { ActivityType, PresenceUpdateStatus } from "discord.js";
let activityType, statusText, displayStatus, statusUrl, statusSubText;
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
    statusText = getConfig().statusText;
    statusSubText = getConfig().statusSubText;
    statusUrl = getConfig().statusUrl;
    if (getConfig().activity !== false && getConfig().statusText === false) {
        console.warn(colorLog.yellow, '[W] Cannot disable statusText if activity is enabled! Disabling activity.');
        modifyConfig((doc) => { doc.set('activity', false); });
    }
    else if (activityType === ActivityType.Custom) {
        console.warn(colorLog.yellow, '[W] activity is required for statusSubText to work. Only statusText will be displayed!');
        statusSubText = 'No substatus';
        client.user?.setActivity({
            type: ActivityType.Custom,
            name: statusText
        });
    }
    else if (getConfig().statusSubText !== false && getConfig().statusText === false) {
        console.warn(colorLog.yellow, '[W] statusText and activity is required for statusSubText to work. This will display nothing at all!');
        statusText = 'No status';
        statusSubText = 'No substatus';
        client.user?.setActivity({
            name: '',
        });
    }
    else if (getConfig().activity === false && getConfig().statusText === false) {
        client.user?.setActivity({
            name: '',
        });
    }
    else if (getConfig().statusUrl === false && getConfig().statusSubText === false) {
        client.user?.setActivity({
            type: activityType,
            name: statusText,
        });
    }
    else if (getConfig().statusUrl === false) {
        client.user?.setActivity({
            type: activityType,
            name: statusText,
            state: statusSubText
        });
    }
    else if (getConfig().statusSubText === false) {
        client.user?.setActivity({
            type: activityType,
            name: statusText,
            url: statusUrl
        });
    }
    else {
        client.user?.setActivity({
            type: activityType,
            name: statusText,
            state: statusSubText,
            url: statusUrl
        });
    }
    if (getConfig().activity === 'Streaming') {
        console.log(colorLog.dim, `[I] Reloaded bot status (Streaming - ${displayStatus}, ${statusSubText || 'No Subtext'})`);
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
        if (getConfig().verbose) {
            console.log(colorLog.dim, `[I] Reloaded bot status (${getConfig().status} - ${displayStatus || 'No status'}, ${statusSubText || 'No substatus'})`);
        }
        ;
    }
}
