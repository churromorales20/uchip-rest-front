const menuConstructor = (menu_items, parent) => {
    return menu_items.filter((item) => item.parent === parent).map((item) => {
        return {
            icon: item.icon,
            link: item.link,
            order: item.order,
            title: item.title,
            children: parent === 0 ? menuConstructor(menu_items, item.id) : null,
        };
    }).sort((item_a, item_b) => {
        if (item_a.order < item_b.order) {
            return -1;
        }
        if (item_a.order > item_b.order) {
            return 1;
        }
        return 0;
    });
}
export { menuConstructor }; // 