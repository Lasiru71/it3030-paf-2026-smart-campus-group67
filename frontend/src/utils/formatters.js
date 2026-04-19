/**
 * Formats a location string, handling distributed inventory format.
 * @param {string} locationStr - The location string from the database.
 * @returns {string} - A human-friendly location description.
 */
export const renderLocation = (locationStr) => {
  if (!locationStr) return "—";
  
  if (locationStr.startsWith("DISTRIBUTED:")) {
    try {
      const jsonStr = locationStr.replace("DISTRIBUTED:", "");
      const data = JSON.parse(jsonStr);
      
      if (data.locations && data.locations.length > 0) {
        const blockNames = [...new Set(data.locations.map(l => l.block))];
        const count = blockNames.length;
        
        if (count === 1) {
          return `Distributed in ${blockNames[0]}`;
        }
        return `Distributed across ${count} Blocks`;
      }
      return "Distributed";
    } catch (e) {
      console.error("Error parsing distributed location:", e);
      return "Distributed Resource";
    }
  }
  
  return locationStr;
};
