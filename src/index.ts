// function classDescriptor(description: string) {
//   return function (target: Function) {
//     //保存到该类的原型中
//     target.prototype.$classDescription = description;
//   };
// }
// function propDescriptor(description: string) {
//   return function (target: any, propName: string) {
//     //把所有的属性信息保存到该类的原型中
//     if (!target.$propDescriptions) {
//       target.$propDescriptions = [];
//     }
//     target.$propDescriptions.push({
//       propName,
//       description,
//     });
//   };
// }
// function printObj(obj: any) {
//   //输出类的名字
//   if (obj.$classDescription) {
//     console.log(obj.$classDescription);
//   } else {
//     console.log(Object.getPrototypeOf(obj).constructor.name);
//   }
//   if (!obj.$propDescriptions) {
//     obj.$propDescriptions = [];
//   }
//   //输出所有的属性描述和属性值
//   for (const key in obj) {
//     if (obj.hasOwnProperty(key)) {
//       const prop = obj.$propDescriptions.find((p: any) => p.propName === key);
//       if (prop) {
//         console.log(`\t${prop.description}:${obj[key]}`);
//       } else {
//         console.log(`\t${key}:${obj[key]}`);
//       }
//     }
//   }
// }
// import { classDescriptor, propDescriptor, printObj } from "./Descriptor";

import { Game } from "./core/Game";
import { GamePageViewer } from "./core/viewer/GamePageViewer";

// @classDescriptor("文章")
// class Article {
//   @propDescriptor("标题")
//   title: string = "";

//   @propDescriptor("内容")
//   content: string = "";

//   @propDescriptor("日期")
//   date: Date = new Date();
// }

// const ar = new Article();
// ar.title = "xxxx";
// ar.content = "asdfasdfasdfasdfasdf";
// ar.date = new Date();

// printObj(ar);
new Game(new GamePageViewer());
