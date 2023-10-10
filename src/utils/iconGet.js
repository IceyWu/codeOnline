import iconHtml from "~/assets/icons/html.svg";
import iconFolder from "~/assets/icons/folder.svg";
import iconVue from "~/assets/icons/vue.svg";
import iconTxt from "~/assets/icons/txt.svg";
import iconOther from "~/assets/icons/other.svg";

export const iconGet = (suffix) => {
  switch (suffix) {
    case "html":
      return iconHtml;
    case "folder":
      return iconFolder;
    case "vue":
      return iconVue;
    case "txt":
      return iconTxt;
    default:
      return iconOther;
  }
};
