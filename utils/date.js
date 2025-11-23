const formatDate = (dateValue) => {
    if (!dateValue) return '';
    const date = new Date(dateValue);
    if (isNaN(date)) return dateValue;
    
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const formatDateChrono = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    // Formatage MM:SS
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    
    return `${formattedMinutes}:${formattedSeconds}`;
};

export { formatDate, formatDateChrono };