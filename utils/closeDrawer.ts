export const closeDrawer = () => {
    const elm = document.querySelector("#my-drawer-3") as HTMLInputElement;
    if (elm != undefined) elm.checked = false;
}