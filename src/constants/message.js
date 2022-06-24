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
          validateSystemFields: "id, created_at, updated_at is system fields please try other names",
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
        form: {
          name:"Name",
          email:"Email",
          password:"Password",
          internal:"Is Internal",
          status:"Status",
          roles:"Roles",
          noRole:"No Roles Avilable",
        }
      },
      modifyRole:{
        header: {
          title: "Modify Role",
          content: "",
        },
      },
      createRole:{
        header: {
          title: "Create Role",
          content: "",
        },
      },
      modifyPermission:{
        header: {
          title: "Modify Permission",
          content: "",
        },
      },
      createPermission:{
        header: {
          title: "Create Permission",
          content: "",
        },
      },
      roles: {
        header: {
          title: "Roles",
          content: "Create and modify roles",
        },
        form: {
          name:"Name",
          permissions:"Permissions",
          noPermission:"No Permission Found"
        }
      },
      permissions: {
        header: {
          title: "Permissions",
          content: "Create and modify permissions",
        },
        form:{
          label:"Permission Label",
          key:"Permission Key",
        }
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
    noDataFound:"No Data Found",
    confirmation:{
      delete: "Are you sure you want to delete this?",
      update: "Are you sure you want to update this?",
      create: "Are you sure you want to create this?",
      applyPermission: "Are you sure you want to apply this permissions for this module ?",
    },
    loginBox:{
      title: "Login",
      email: "Email",
      password: "Password",
      login:"Login"
    }
  },
};
export default message;
