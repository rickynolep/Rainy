export default function convertMention(message: any) {
    let messageContent: string = message.content;
    if (message.mentions.members && message.mentions.members.size > 0) {
        message.mentions.members.forEach((member: any) => {
            const mentionPattern = new RegExp(`<@!?${member.id}>`, 'g');
            messageContent = messageContent.replace(mentionPattern, `${member.displayName} (<@${member.id}>)`);
        });
    };
    return messageContent;
}