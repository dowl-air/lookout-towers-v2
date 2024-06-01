export const closeDrawer = () => {
    const elm = document.querySelector("#side-drawer") as HTMLInputElement;
    if (elm !== undefined) elm.checked = false;
};