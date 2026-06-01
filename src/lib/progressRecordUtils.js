export const groupProgressRecordsByStudent = (records = []) =>
  records.reduce((grouped, record = {}) => {
    const userId = record.userId || '';
    if (!userId) return grouped;

    return {
      ...grouped,
      [userId]: [...(grouped[userId] || []), record]
    };
  }, {});
