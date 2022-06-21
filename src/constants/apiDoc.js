const apiDoc = [
    {
      label: "Get data",
      method: "GET",
      api: "{url}/api/v1/storage/{module}",
      doc: `
let url = "{url}/api/v1/storage/{module}";
let queryObj = {
    select: '[]',
    condition: '[]',
    limit: 0,
    skip: 0,
    join: '[]',
    sortBy: '',
    orderBy: '',
    groupBy: '',
};
let urlSearchParama = new URLSearchParams();
Object.keys(queryObj).forEach(key=>{
urlSearchParama.append(key, queryObj[key])
})
url+='?'+urlSearchParama.toString()
fetch(url,{method: "GET", headers: { 'Content-Type': 'application/json' } }).then(res=>res.json()).then(res=>{ console.log(res); })`,
      example: ``
    },
    {
        label: "GET data by id",
        method: "GET",
        api: "{url}/api/v1/storage/{module}/{id}",
        doc: `
let url = "{url}/api/v1/storage/{module}/{id}";
fetch(url,{method: "GET", headers: { 'Content-Type': 'application/json' }}).then(res=>res.json()).then(res=>{ console.log(res); })`,
        example: ``
      },
      {
        label: "Get data",
        method: "GET",
        api: "{url}/api/v1/storage/{module}/count",
        doc: `
  let url = "{url}/api/v1/storage/{module}/count";
  let queryObj = {
      select: '[]',
      condition: '[]',
      join: '[]',
      groupBy: '',
  };
  let urlSearchParama = new URLSearchParams();
  Object.keys(queryObj).forEach(key=>{
  urlSearchParama.append(key, queryObj[key])
  })
  url+='?'+urlSearchParama.toString()
  fetch(url,{method: "GET", headers: { 'Content-Type': 'application/json' } }).then(res=>res.json()).then(res=>{ console.log(res); })`,
        example: ``
      },
    {
        label: "Put Single data",
        method: "PUT",
        api: "{url}/api/v1/storage/{module}",
        doc: `
let url = "{url}/api/v1/storage/{module}";
let dataObj = {}
fetch(url,{method: "PUT", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dataObj) }).then(res=>res.json()).then(res=>{ console.log(res); })`,
        example: ``
      },
      {
          label: "Put Multiple data",
          method: "PUT",
          api: "{url}/api/v1/storage/{module}/insertBulk",
          doc: `
let url = "{url}/api/v1/storage/{module}/insertBulk";
const datas = [];
let dataObj = {
    data: JSON.stringify(datas)
};
fetch(url,{method: "PUT", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dataObj) }).then(res=>res.json()).then(res=>{ console.log(res); })`,
          example: ``
        },
          {
              label: "Update data using conditions",
              method: "PATCH",
              api: "{url}/api/v1/storage/{module}",
              doc: `
let url = "{url}/api/v1/storage/{module}";
let dataObj = {
  
};
let urlSearchParama = new URLSearchParams();
Object.keys({condition: JSON.stringify([])}).forEach(key=>{
urlSearchParama.append(key, queryObj[key])
})
url+='?'+urlSearchParama.toString()
fetch(url,{method: "PATCH", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dataObj) }).then(res=>res.json()).then(res=>{ console.log(res); })`,
              example: ``
          },
          {
              label: "Update data by id",
              method: "PATCH",
              api: "{url}/api/v1/storage/{module}/{id}",
              doc: `
let url = "{url}/api/v1/storage/{module}/{id}";
let dataObj = {
    
};
fetch(url,{method: "PATCH", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dataObj) }).then(res=>res.json()).then(res=>{ console.log(res); })`,
              example: ``
            },
            {
                label: "delete data by id",
                method: "DELETE",
                api: "{url}/api/v1/storage/{module}/{id}",
                doc: `
let url = "{url}/api/v1/storage/{module}/{id}";
fetch(url,{method: "DELETE", headers: { 'Content-Type': 'application/json' } }).then(res=>res.json()).then(res=>{ console.log(res); })`,
                example: ``
              },
              {
                  label: "delete data using condition",
                  method: "DELETE",
                  api: "{url}/api/v1/storage/{module}",
                  doc: `
let url = "{url}/api/v1/storage/{module}";
let urlSearchParama = new URLSearchParams();
Object.keys({condition: JSON.stringify([])}).forEach(key=>{
urlSearchParama.append(key, queryObj[key])
})
url+='?'+urlSearchParama.toString()
fetch(url,{method: "DELETE", headers: { 'Content-Type': 'application/json' } }).then(res=>res.json()).then(res=>{ console.log(res); })`,
                  example: ``
                },
  ]

  export default apiDoc