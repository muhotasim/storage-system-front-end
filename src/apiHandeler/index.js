import appConst from "../constants/appConst"

class ApiHandeler{
    constructor(token = ""){
       this.url = appConst.apiUrl; 
       this.token = token;//"demotokendata"
    }
    /******* app *******/
    createApp(data = {appName: "", appPrefix: "", status: 1}){
        const url = this.url+"/api/v1/apps";
        
        return new Promise((resolve,reject)=>{
            fetch(url,{
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+this.token,
                },
                body: JSON.stringify({
                    name: data.appName,
                    prefix: data.appPrefix,
                    status: data.status,
                })
            }).then(res=>{
                resolve(res);
            }).catch(e=>{
                reject(e);
            })
        })
    }
    getAppData(){
        const url = this.url+"/api/v1/apps?sortBy=created_at&orderBy=desc";
        return new Promise((resolve,reject)=>{
            fetch(url,{
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+this.token,
                },
            }).then(res=>{
                resolve(res);
            }).catch(e=>{
                reject(e);
            })
        })
    }
    modifyApp(id, data = {appName: "", appPrefix: "", status: 1}){
        const url = this.url+"/api/v1/apps/"+id;
        return new Promise((resolve,reject)=>{
            fetch(url,{
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+this.token,
                },
                body: JSON.stringify({
                    name: data.appName,
                    prefix: data.appPrefix,
                    status: data.status,
                })
            }).then(res=>{
                resolve(res);
            }).catch(e=>{
                reject(e);
            })
        })
    }

    deleteApp(id){
        const url = this.url+"/api/v1/apps/"+id;
        return new Promise((resolve,reject)=>{
            fetch(url,{
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+this.token,
                }
            }).then(res=>{
                resolve(res);
            }).catch(e=>{
                reject(e);
            })
        })
    }

    /******* module *******/
    createModule(data){
        const url = this.url+"/api/v1/models"
        return new Promise((resolve,reject)=>{
            fetch(url,{
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+this.token,
                },
                body: JSON.stringify(data)
            }).then(res=>{
                resolve(res);
            }).catch(e=>{
                reject(e);
            })
        })
    }
    deleteModule(tableName){
        const url = this.url+"/api/v1/models";
        return new Promise((resolve,reject)=>{
            fetch(url,{
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+this.token,
                },
                body:JSON.stringify({
                    tableName: tableName
                })
            }).then(res=>{
                resolve(res);
            }).catch(e=>{
                reject(e);
            })
        })

    }
    getModule(query = {}){
        let url = this.url+"/api/v1/models"
        let searchParams = new URLSearchParams();
        Object.keys(query).forEach(key=>{
            searchParams.append(key,query[key])
        })
        url+='?'+searchParams.toString();
        return new Promise((resolve,reject)=>{
            fetch(url,{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+this.token,
                },
            }).then(res=>{
                resolve(res);
            }).catch(e=>{
                reject(e);
            })
        })
    }
    getAllModuleData(){
        
        const url = this.url+"/api/v1/models"
        return new Promise((resolve,reject)=>{
            fetch(url,{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+this.token,
                }
            }).then(res=>{
                resolve(res);
            }).catch(e=>{
                reject(e);
            })
        })
    }
    addField(module, field){
        
        const url = this.url+"/api/v1/models/add-field"
        
        return new Promise((resolve,reject)=>{
            fetch(url,{
                method:"POST",
                body:JSON.stringify({
                    tableName:module,
                    field: JSON.stringify(field)
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+this.token,
                }
            }).then(res=>{
                resolve(res);
            }).catch(e=>{
                reject(e);
            })
        })
    }
    removeField(module, field){
        
        const url = this.url+"/api/v1/models/remove-field"
        
        return new Promise((resolve,reject)=>{
            fetch(url,{
                method:"POST",
                body:JSON.stringify({
                    tableName:module,
                    columnName:field
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+this.token,
                }
            }).then(res=>{
                resolve(res);
            }).catch(e=>{
                reject(e);
            })
        })
    }
    renameField(module, oldFieldName, newField){
        
        const url = this.url+"/api/v1/models/rename"
        
        return new Promise((resolve,reject)=>{
            fetch(url,{
                method:"POST",
                body:JSON.stringify({
                    tableName:module,
                    oldColumnName:oldFieldName,
                    field: JSON.stringify(newField)
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+this.token,
                }
            }).then(res=>{
                resolve(res);
            }).catch(e=>{
                reject(e);
            })
        })
    }

    login(email, password){
        let url = this.url+"/api/auth/token";
        return new Promise((resolve,reject)=>{
            fetch(url,{
                method: "POST",
                body: JSON.stringify({email, password}),
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(res=>{
                resolve(res);
            }).catch(e=>{
                reject(e);
            })
        })
    }
    /******* data *******/ 
    query(module,query){
        let url = this.url+"/api/v1/storage/"+module;
        let urlSearchParama = new URLSearchParams();
        Object.keys(query).forEach(key=>{
            urlSearchParama.append(key, query[key]);
        })
        url+='?'+urlSearchParama.toString();
        return new Promise((resolve,reject)=>{
            fetch(url,{
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+this.token,
                },
            }).then(res=>{
                resolve(res);
            }).catch(e=>{
                reject(e);
            })
        })
    }
    count(module,query){
        let url = this.url+"/api/v1/storage/"+module+'/count';
        let urlSearchParama = new URLSearchParams();
        Object.keys(query).forEach(key=>{
            urlSearchParama.append(key, query[key]);
        })
        url+='?'+urlSearchParama.toString();
        return new Promise((resolve,reject)=>{
            fetch(url,{
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+this.token,
                },
            }).then(res=>{
                resolve(res);
            }).catch(e=>{
                reject(e);
            })
        })
    }
    
    insert(module,data = {}){
        const url = this.url+"/api/v1/"+module
        return new Promise((resolve,reject)=>{
            fetch(url,{
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+this.token,
                },
                body: JSON.stringify(data)
            }).then(res=>{
                resolve(res);
            }).catch(e=>{
                reject(e);
            })
        })
    }
    applyPermission(moduleId, data){
        const url = this.url+"/api/v1/models/apply-permission";
        return new Promise((resolve,reject)=>{
            fetch(url,{
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+this.token,
                },
                body: JSON.stringify({
                    moduleId: moduleId,
                    data: data
                })
            }).then(res=>{
                resolve(res);
            }).catch(e=>{
                reject(e);
            })
        })
    }
    insertUser(module,data = {}){
        const url = this.url+"/api/v1/"+module
        return new Promise((resolve,reject)=>{
            fetch(url,{
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+this.token,
                },
                body: JSON.stringify(data)
            }).then(res=>{
                resolve(res);
            }).catch(e=>{
                reject(e);
            })
        })
    }
    insertBulk(data = []){
        
        const url = this.url+"/api/v1/storage"
        return new Promise((resolve,reject)=>{
            resolve({})
        })
    }
    get(module, id){
        
        const url = this.url+"/api/v1/storage/"+module+"/"+id
        return new Promise((resolve,reject)=>{
            fetch(url,{
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+this.token,
                },
            }).then(res=>{
                resolve(res);
            }).catch(e=>{
                reject(e);
            })
        })
    }
    update(id, module, data){
        const url = this.url+"/api/v1/storage/"+module+"/"+id
        return new Promise((resolve,reject)=>{
            fetch(url,{
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+this.token,
                },
                body: JSON.stringify(data)
            }).then(res=>{
                resolve(res);
            }).catch(e=>{
                reject(e);
            })
        })
    }
    updateUser(id, module, data){
        const url = this.url+"/api/v1/"+module+"/"+id
        return new Promise((resolve,reject)=>{
            fetch(url,{
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+this.token,
                },
                body: JSON.stringify(data)
            }).then(res=>{
                resolve(res);
            }).catch(e=>{
                reject(e);
            })
        })
    }
    updateBulk(module, condition, data){
        
        const url = this.url+"/api/v1/storage"
        return new Promise((resolve,reject)=>{
            resolve({})
        })
    }
    delete(module, id){
        
        const url = this.url+"/api/v1/storage/"+module+"/"+id
        return new Promise((resolve,reject)=>{
            fetch(url,{
                method:"DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+this.token,
                }
            }).then(res=>{
                resolve(res);
            }).catch(e=>{
                reject(e);
            })
        })
    }
    deleteBulk(module, condition){
        
        const url = this.url+"/api/v1/storage"
        return new Promise((resolve,reject)=>{
            resolve({})
        })
    }
}

export default ApiHandeler;