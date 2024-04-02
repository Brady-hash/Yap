const belongsToThread = (participantsIds, userId) => {
    const isParticipant = participantsIds.some(id => id.toString() === userId);
    console.log('Is Participant:', isParticipant);
    return isParticipant;
}

module.exports = { belongsToThread }