async function readItem(model, filter = {}, projection = null, options = {}) {
  const data = await model.findOneAndUpdate(filter, projection, options);
  return data;
}

async function readItems(model, filter = {}, projection = null, options = {}) {
  return await model.find(filter, projection, options);
}

async function readItemById(model, id, projection = null, options = {}) {
  const data = await model.findById(id, projection, options);
  if (!data) throw new Error("Document not found");
  return data;
}

async function createItem(model, data) {
  const item = new model(data);
  return await item.save();
}

async function updateItem(model, updateData, filter = null, options = {}) {
  let updatedDoc;

  if (filter && filter._id) {
    // Update theo ID
    updatedDoc = await model.findByIdAndUpdate(
      filter._id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
        ...options,
      }
    );
  } else {
    // Update document đầu tiên tìm được
    updatedDoc = await model.findOneAndUpdate(
      {},
      { $set: updateData },
      {
        new: true,
        runValidators: true,
        ...options,
      }
    );
  }

  if (!updatedDoc) throw new Error("Document not found");

  return updatedDoc;
}

async function deleteItem(model, id) {
  if (!id) throw new Error("ID is required");
  const deletedDoc = await model.findByIdAndDelete(id);
  if (!deletedDoc) throw new Error("Document not found");
  return deletedDoc;
}

module.exports = {
  readItem,
  readItems,
  createItem,
  updateItem,
  deleteItem,
  readItemById,
};
