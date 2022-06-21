import apiDoc from "./apiDoc";

const message = {
  en: {
    pages: {
      apps: {
        header: {
          title: "Apps",
          content: "Create and modify apps",
        },
        appList: "App List",
        changeStatus: "Change Status",
        errors:{
            loadFailed: "Failed To Load App Data!!",
            validation: "Please provide all the values",
            uniquePrefix: "Please a unique prefix for the app",
        }
      },
      createUser:{
        header: {
          title: "Modify User",
          content: "",
        },

      },
      modules: {
        header: {
          title: "Modules",
          content: "Create and modify module for apps and get api",
        },
        form:{
          title: "Module Title",
          name: "Module Name",
          appName: "App",
          status: "Status",
          fieldList: "Add fields for the module",
          validate: "Please provide all the value currectly to save module",
          add: "Add",
          remove: "Remove",
          create: "Create",
          update: "Update",
          save: "Save",
          cancel:"Cancel",
          status: "Change status of the module",
          fieldCard:{
            name: "Name",
            dataType: "Type",
            length: "Length",
            options: "Options",
            addOption: "Add Options",
          }
        },
        searchbox:{
          select:"Select fields",
          order: "Order",
          group: "Group By",
          filter: "Filter",
          limit: "Limit",
          conditions:"Conditions",
          or:"OR",
          and:"AND"
        },
        moduleList: "Module List",
        searchPlaceholder: "Search for modules",
        noDataFound: "No data found",
        apiList: "Api List",
        apiListDoc: apiDoc,
        apiDocCard:{
          title: "Title",
          method: "Method",
          label: "Label",
          api: "Api",
          docTitle: "Api implementation with code",
          exTitle: ""
        }
      },
      users: {
        header: {
          title: "Users",
          content: "Create and modify users",
        },
      },
      roles: {
        header: {
          title: "Roles",
          content: "Create and modify roles",
        },
      },
      permissions: {
        header: {
          title: "Permissions",
          content: "Create and modify permissions",
        },
      },
    },
    statusText:{
      active: "Active",
      inactive: "Inactive",
    },
    form:{
        cancel: "Cancel",
        save: "Create",
        update: "Update",
        modifyApp:{
            name: "App Name",
            appPrefix: "App Prefix",
            status: "Status"
        }
    },
    failToLoad: "Failed to load data",
    successLoad: "Successfully data loaded",
    loading: "Loading",
    failedToSave: "Failed to save data",
    failedToRemove: "Failed to remove data",
    failedToUpdate: "Failed to update data",
    successSave: "Saved successfully",
    updatedSave: "Updated successfully",
    deletedSuccess: "Deleted successfully",
    noDataFound:"No Data Found"
  },
};
export default message;
