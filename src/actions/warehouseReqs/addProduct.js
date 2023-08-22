export const handleAddStoreAsCode = (value, reqItemId, currentReqItems, setCurrentReqItems) => {
    const items = [...currentReqItems];
    const itemIndex = items.findIndex(tr => tr._id === reqItemId.itemId);
    const item = items[itemIndex];
    item.storeAsCode = value;
    const allItems = [...items];
    allItems[itemIndex] = item;
    setCurrentReqItems(allItems)
}