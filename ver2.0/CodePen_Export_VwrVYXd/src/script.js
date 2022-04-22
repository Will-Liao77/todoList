const form = document.querySelector("#itemForm");
const itemInput = document.querySelector("#itemInput");
const itemsList = document.querySelector("#itemsList");
const filters = document.querySelectorAll(".nav-item");
const alertDiv = document.querySelector("#message");
let todoList = [];

const updateItem = function (currentItemIndex, value) {
  const newItem = todoList[currentItemIndex];
  newItem.name = value;
  todoList.splice(currentItemIndex, 1, newItem);
  setLocalStorage(todoList);
};

const removeItem = function (item) {
  const removeIndex = todoList.indexOf(item);
  todoList.splice(removeIndex, 1);
};

filters.forEach((tab) => {
  tab.addEventListener("click", function (e) {
    e.preventDefault();
    const tabType = this.getAttribute("data-type");
    document.querySelectorAll(".nav-link").forEach((nav) => {
      nav.classList.remove("active");
    });
    this.firstElementChild.classList.add("active");
    getItemsFilter(tabType);
    document.querySelector("#tabValue").value = tabType;
  });
});

const alertMessage = function (message, className) {
  alertDiv.innerHTML = message;
  alertDiv.classList.add(className, "show");
  alertDiv.classList.remove("hide");
  setTimeout(() => {
    alertDiv.classList.add("hide");
    alertDiv.classList.remove("show");
  }, 3000);
};

const getItemsFilter = function (type) {
  let filterItems = [];
  switch (type) {
    case "todo":
      filterItems = todoList.filter((item) => !item.isDone);
      break;
    case "done":
      filterItems = todoList.filter((item) => item.isDone);
      break;
    case "delete":
      filterItems = todoList.filter((item) => item.isDelete);
      break;
    default:
      filterItems = todoList;
  }
  getList(filterItems);
};
//////////////////////////////////
//新增一項物件至列表中
//////////////////////////////////
const getList = function (todoList) {
  itemsList.innerHTML = "";
  //2.1
  if (todoList.length > 0) {
    //2.2
    todoList.forEach((item) => {
      const iconClass = item.isDone
        ? "bi-check-circle-fill"
        : "bi-check-circle";
      const iconDeleteClass = item.isDelete
        ? "bi-x-circle-fill"
        : "bi-x-circle";

      let liTag = `
      <li class="list-group-item d-flex justify-content-between align-items-center">        <span class="title" data-time=${item.addedAt}>${item.name}</span>
          <span>
            <a href="#" data-done><i class="bi ${iconClass}  green"></i></a>
            <a href="#" data-edit><i class="bi bi-pencil-square blue"></i></a>
            <a href="#" data-delete><i class="bi ${iconDeleteClass} red"></i></a>
          </span>
        </li>`;
      //
      itemsList.insertAdjacentHTML("beforeend", liTag);
      handleItem(item);
      //
    });
  } else {
    // nothing to display
    let liTag = `
        <li class="list-group-item d-flex justify-content-between align-items-center">
               <span>No Records Found.</span>
        </li>`;
    itemsList.insertAdjacentHTML("beforeend", liTag);
  }
};
//////////////////////////////////
//設定與儲存LocalStorage
//////////////////////////////////
const setLocalStorage = function (todoList) {
  localStorage.setItem("todoList", JSON.stringify(todoList));
};

const getLocalStorage = function () {
  const todoStorage = localStorage.getItem("todoList");
  if (todoStorage === "undefined" || todoStorage === null) {
    todoList = [];
  } else {
    todoList = JSON.parse(todoStorage);
  }

  console.log("items", todoList);
  getList(todoList);
};
//////////////////////////////////
//處理輸入資料
//////////////////////////////////
document.addEventListener("DOMContentLoaded", () => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const itemName = itemInput.value.trim();
    // console.log(itemName);
    if (itemName.length === 0) {
      alertMessage("Please enter name", "alert-danger");
    } else {
      const currentItemIndex = document.querySelector("#objIndex").value;
      if (currentItemIndex) {
        //update
        updateItem(currentItemIndex, itemName);
        document.querySelector("#objIndex").value = "";
        alertMessage("Item has been updated", "alert-success");
      } else {
        const itemObj = {
          name: itemName,
          isDone: false,
          isDelete: false,
          addedAt: new Date().getTime()
        };
        todoList.push(itemObj);
        setLocalStorage(todoList);
        alertMessage("New Item has been added", "alert-success");
      }
      // console.log("2...2");
      getList(todoList);
    }
    // console.log("1...1");
    getLocalStorage();
    itemInput.value = "";
  });
  getLocalStorage();
});
//////////////////////////////////
//處理按鈕事件
//////////////////////////////////
const handleItem = function (itemData) {
  const items = document.querySelectorAll(".list-group-item");
  items.forEach((item) => {
    //done 我抓取的item產生時間與所對應的產生時間相同
    if (
      item.querySelector(".title").getAttribute("data-time") == itemData.addedAt
    ) {
      item.querySelector("[data-done]").addEventListener("click", function (e) {
        e.preventDefault();

        const itemIndex = todoList.indexOf(itemData);
        const currentItem = todoList[itemIndex];

        //符號變色
        const currentClass = currentItem.isDone
          ? "bi-check-circle-fill"
          : "bi-check-circle";

        currentItem.isDone = currentItem.isDone ? false : true;
        //把選定的 item 先分別出來,接著更新在 localStorage 的資料
        todoList.splice(itemIndex, 1, currentItem);
        setLocalStorage(todoList);

        //設定 icon 的變化
        const iconClass = currentItem.isDone
          ? "bi-check-circle-fill"
          : "bi-check-circle";
        this.firstElementChild.classList.replace(currentClass, iconClass);
        //切換 tab
        const filterType = document.querySelector("#tabValue").value;
        // console.log(filterType);
        getItemsFilter(filterType);
      });

      //delete
      item
        .querySelector("[data-delete]")
        .addEventListener("click", function (e) {
          e.preventDefault();
          const itemIndex = todoList.indexOf(itemData);
          const currentItem = todoList[itemIndex];
          if (!currentItem.isDelete) {
            //console.log("i did it");
            if (confirm("Are you sure you want to remove this item?")) {
              //符號變色
              const currentClass = currentItem.isDelete
                ? "bi-x-circle-fill"
                : "bi-x-circle";

              currentItem.isDelete = currentItem.isDelete ? false : true;
              //把選定的 item 先分別出來,接著更新在 localStorage 的資料
              todoList.splice(itemIndex, 1, currentItem);
              setLocalStorage(todoList);

              //設定 icon 的變化
              const iconClass = currentItem.isDelete
                ? "bi-x-circle-fill"
                : "bi-x-circle";
              this.firstElementChild.classList.replace(currentClass, iconClass);
              //切換 tab
              const filterType = document.querySelector("#tabValue").value;
              // console.log(filterType);
              getItemsFilter(filterType);
            }
          } else {
            const currentClass = currentItem.isDelete
              ? "bi-x-circle-fill"
              : "bi-x-circle";

            currentItem.isDelete = currentItem.isDelete ? false : true;
            //把選定的 item 先分別出來,接著更新在 localStorage 的資料
            todoList.splice(itemIndex, 1, currentItem);
            setLocalStorage(todoList);

            //設定 icon 的變化
            const iconClass = currentItem.isDelete
              ? "bi-x-circle-fill"
              : "bi-x-circle";
            this.firstElementChild.classList.replace(currentClass, iconClass);
            //切換 tab
            const filterType = document.querySelector("#tabValue").value;
            // console.log(filterType);
            getItemsFilter(filterType);
          }
        });
      //edit
      item.querySelector("[data-edit]").addEventListener("click", function (e) {
        e.preventDefault();
        itemInput.value = itemData.name;
        document.querySelector("#objIndex").value = todoList.indexOf(itemData);
      });
      //delete
      // item
      //   .querySelector("[data-delete]")
      //   .addEventListener("click", function (e) {
      //     e.preventDefault();
      //     if (confirm("Are you sure you want to remove this item?")) {
      //       itemsList.removeChild(item);
      //       removeItem(item);
      //       setLocalStorage(todoList);
      //       alertMessage("Item has been deleted", "alert-success");
      //     }
      //   });
    }
  });
};
