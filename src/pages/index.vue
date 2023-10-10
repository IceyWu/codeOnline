<script setup>
import { ElMessage } from "element-plus";

onMounted(() => {});

const folderList = ref([]);

const processHandler = async (handle) => {
  const addPart = {
    type: handle.kind,
    name: handle.name,
    children: [],
    FileSystemFileHandle: null,
  };
  if (handle.kind === "file") {
    return handle;
  }
  handle.children = [];
  const iter = await handle.entries();
  for await (const info of iter) {
    const subHandle = await processHandler(info[1]);
    // console.log("🌳-----subHandle-----", subHandle);
    const addP = {
      type: subHandle.kind,
      name: subHandle.name,
      FileSystemFileHandle: structuredClone(subHandle),
    };
    // console.log("🐳-----addP-----", addP);
    handle.children.push(subHandle);
    addPart.children.push(addP);
  }
  folderList.value = [addPart];
  return handle;
};

const openFile = async () => {
  try {
    // 获得文件夹的句柄
    const handle = await showDirectoryPicker({
      mode: "readwrite",
    });
    const root = await processHandler(handle);
  } catch {
    //用户拒绝查看文件
    ElMessage.error("用户拒绝查看文件");
  }
};
const defaultProps = {
  children: "children",
  label: "name",
};
const getFileContent = (file) => {
  return new Promise((resolve) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.readAsText(file, "utf-8");
  });
};
const chooseFileSystemFileHandle = ref(null);

const handleNodeClick = async (data) => {
  // console.log("🌵-----handleNodeClick-----", data);
  const { FileSystemFileHandle, type } = data;
  if (type === "file") {
    const file = (await FileSystemFileHandle.getFile()) || "";
    chooseFileSystemFileHandle.value = FileSystemFileHandle;
    // console.log("🎁-----file-----", file);
    // const reader = new FileReader();
    // console.log("🎉-----reader-----", reader);
    try {
      const content = await getFileContent(file);
      showCode.value = content;
      console.log("🌵-----content-----", content);
    } catch (error) {
      console.log("🌵-----error-----", error);
    }
  }
};
const handleSaveFile = async () => {
  // const handle = await showSaveFilePicker();
  // console.log("🌵-----handle-----", handle);
  // const writable = await handle.createWritable();
  // await writable.write(showCode.value);
  // await writable.close();

  console.log(
    "🎁chooseFileSystemFileHandle.value------------------------------>",
    showCode.value,
    highlightRef.value,
  );
  chooseFileSystemFileHandle.value.createWritable().then((writable) => {
    writable.write(showCode.value);
    writable.close();
  });
};

const showCode = ref("");
const highlightRef = ref(null);
</script>

<template>
  <div class="h-screen w-full gap-5">
    <h1>Hello Nginx tool!</h1>

    <el-button type="primary" @click="openFile()">打开文件夹 </el-button>
    <el-button size="small" type="primary" @click="handleSaveFile"
      >保存文件</el-button
    >
    <el-tree
      :data="folderList"
      :props="defaultProps"
      @node-click="handleNodeClick"
    />
    <highlightjs
      ref="highlightRef"
      autodetect
      
      :code="showCode"
    />
  </div>
</template>

<style lang="less" scoped></style>
