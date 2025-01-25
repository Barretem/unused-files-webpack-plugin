import { fnA } from './utils/utils-a';
import { fnB } from './utils/utils-b';

function component() {
  const element = document.createElement('div');

  // 执行这一行需要引入 lodash（目前通过 script 脚本引入）
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  fnB();
  return element;
}

document.body.appendChild(component());