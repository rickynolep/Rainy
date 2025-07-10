export default function convertMention(message) {
    let messageContent = message.content;
    if (message.mentions.members && message.mentions.members.size > 0) {
        message.mentions.members.forEach((member) => {
            const mentionPattern = new RegExp(`<@!?${member.id}>`, 'g');
            messageContent = messageContent.replace(mentionPattern, `${member.displayName} (<@${member.id}>)`);
        });
    }
    ;
    return messageContent;
}
