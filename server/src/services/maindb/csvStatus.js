const client = require("../../../prisma/main/client");
const createCsvStatus = async (data) => {
  return await client.cSVStatus.create({
    data,
  });
};

const allowedStatuses = ["In queue", "Processing", "Done", "Failed"];
const updateCsvStatus = async (id, status, errors = null) => {
  if (!id) {
    throw new Error("updateCsvStatus: CSV file id is required.");
  }
  if (!allowedStatuses.includes(status)) {
    throw new Error(
      `updateCsvStatus: Invalid status "${status}". Allowed statuses are ${allowedStatuses.join(
        ", "
      )}.`
    );
  }
  try {
    await client.cSVStatus.update({
      where: {
        id: id,
      },
      data: {
        status: status,
        errors: errors ? JSON.stringify(errors) : null,
      },
    });
  } catch (error) {
    throw new Error(
      `updateCsvStatus: Failed to update status for id ${id}. Error: ${error.message}`
    );
  }
};
module.exports = { updateCsvStatus, createCsvStatus };
