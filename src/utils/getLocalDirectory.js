export const DirectoryKeySet = new Set(); // 预留对象，多文件夹加载可用
export const DirectoryMap = new Map(); // 预留对象，多文件夹加载可用
export let curDirectory = null; // 当前目录

export const getDirectory = async (id) => {
  let DirectoryHandler;
  try {
    DirectoryHandler = await window.showDirectoryPicker({
      id,
      mode: "readwrite",
    });
  } catch (error) {
    DirectoryHandler = null;
  }
  if (DirectoryHandler !== null) {
    const directory = await getDirectoryHandlerDeep(DirectoryHandler);
    curDirectory = directory;
    return directory;
  }

  return null;
};

export const getFileContent = (file) => {
  return new Promise((resolve) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.readAsText(file, "utf-8");
  });
};
// 获取文件后缀
export const getFileSuffix = (fileName) => {
  const index = fileName.lastIndexOf(".");
  return fileName.substring(index + 1);
};

export const directoryDataFormatter = async (
  directoryHandler,
  path,
  children = []
) => {
  const obj = {
    handler: directoryHandler,
    name: directoryHandler.name,
    kind: directoryHandler.kind,
    path,
    suffix:
      directoryHandler.kind == "directory"
        ? "folder"
        : getFileSuffix(directoryHandler.name),
  };

  if (
    (directoryHandler.kind === "directory" &&
      directoryHandler.name !== "node_modules") ||
    (directoryHandler.kind === "directory" &&
      directoryHandler.name !== "node_modules")
  ) {
    obj.children = children;
  } else if (directoryHandler.kind === "file") {
    obj.content =
      (await getFileContent(await directoryHandler.getFile())) || "";
  }
  return obj;
};

export const getDirectoryHandlerDeep = async (directoryHandler, path) => {
  path = `${path}/${directoryHandler.name}`;
  if (directoryHandler.kind === "file") {
    return await directoryDataFormatter(directoryHandler, path);
  }

  const children = [];
  for await (const handler of directoryHandler.values()) {
    if (
      (handler.kind === "directory" && handler.name === "node_modules") ||
      (handler.kind === "directory" && handler.name === ".git")
    ) {
      continue;
    }

    children.push(await getDirectoryHandlerDeep(handler, path));
  }
  return await directoryDataFormatter(directoryHandler, path, children);
};

export const clearCurDirectory = () => {
  curDirectory = null;
};
