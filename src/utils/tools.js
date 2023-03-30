//工具函数
export  function formatDate(timesStamp){
    const date = new Date(+timesStamp);
    const month = (date.getMonth()+1).toString().padStart(2,"0");
    const day = (date.getDate()).toString().padStart(2,"0");
    let str =  `${date.getFullYear()}-${month}-${day}`;
   
    const hour = date.getHours().toString().padStart(2,"0");
    const minute = date.getMinutes().toString().padStart(2,"0");
    const second = date.getSeconds().toString().padStart(2,"0");

    const weekArr =['星期日','星期一','星期二','星期三','星期四','星期五','星期六'] 
    const week = weekArr[date.getDay()];//得到星期几
    str += `   ${hour}:${minute}:${second}  ${week}`;
        // console.log(str);
    
    return str;
}