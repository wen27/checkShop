let map = new Map(); //創建一個集合

let navTotal = document.querySelector('.m_nav_item:last-child span:last-child')
    //先找到要操作的dom

function add_shoppingcart(btn) {
    // console.log(btn)
    //w3_agileits_services_bottom_l_grid ->btn的父元素
    let ntr = document.createElement("tr"); //incart
    //獲取商品 價錢 名稱 圖片
    let tr = btn.parentNode.parentNode; //獲取到btn的父元素
    //tds w3_agileits_services_bottom_l_grid 裡面兩個div
    let tds = tr.children;
    //console.log(tds)
    //名稱
    let name = tds[1].innerHTML;
    //價格
    let price = tds[2].innerHTML;
    //圖片
    let img = tds[0].innerHTML;
    //console.log(img, name, price)

    if (map.has(name)) {
        var tr1 = map.get(name);
        //console.log(tr1);
        let btn1 = tr1.getElementById("btn1")
            // let btn1 = tr1.getElementByTagName('button')[1];
        plus(btn1);
        console.log(btn1)
    } else {
        ntr.innerHTML = `
        <td style="width:15%">${img}</td>
        <td>${name}</td>
            <td>${price}</td>
            <td>
                <button onclick="reduce(this)">-</button>
                <input type="text" value="1" size="1" />
                <button id="btn1" onclick="plus(this)">+</button>
            </td>
            <td>${price}</td>
            <td style="text-align:center;"><button onclick="del(this)">X</buttton></td>`;

        //將name存到一個數據
        map.set(name, ntr);
        //console.log(ntr)
        //console.log(ntr.children[3].children[1].value)


        //找到incart對象
        let tbody = document.getElementById('goods');

        //把上面建立好的購物車內容加入tobody中
        tbody.appendChild(ntr);
        // console.log(tbody)
        sum();
    }

}
//刪除
function del(btn) {
    //console.log(btn)
    let tr = btn.parentNode.parentNode;
    //console.log(tr)
    tr.remove();
    let trr = btn.parentNode.parentNode;
    //console.log(tr)

    let tds = tr.children;
    //獲取商品名稱
    let name = tds[0].innerHTML;
    //console.log(name)
    map.delete(name); //刪除集合中內容
    sum();
}

//-減少
function reduce(btn) {
    //console.log(btn)
    //獲取減號
    let inpt = btn.nextElementSibling;
    let amount = inpt.value;


    if (amount <= 1) {
        return
    } else {
        inpt.value = --amount;
        //console.log(inpt.value);
        let trs = btn.parentNode.parentNode;
        //console.log(trs)

        var price = parseInt(trs.children[2].innerHTML);
        //console.log(price) //pirce
        trs.children[4].innerHTML = price * amount;
        navTotal.innerHTML = amount;
        // console.log(trs.children[4])
        sum();
    }

}


//+ 增加

function plus(btn) {
    //獲取加號
    let inpt = btn.previousElementSibling;
    let amount = inpt.value;
    inpt.value = ++amount;
    //console.log(inpt.value);
    let td = btn.parentNode.previousElementSibling;
    //console.log(td);
    //string change to number
    let price = parseInt(td.innerHTML);
    let rtd = btn.parentNode.nextElementSibling;
    //console.log(rtd)
    navTotal.innerHTML = amount;
    rtd.innerHTML = price * amount;
    sum();
}

//計算購物車數量


//計算所有購物車總金額
function sum() {
    // console.log(sum);
    let tbody = document.getElementById('goods');
    let trs = tbody.children;

    let total = 0;
    for (i = 0; i < trs.length; i++) {
        let price = trs[i].children[4].innerHTML;

        total = total + parseInt(price);
    }
    let t = document.getElementById('total');
    t.innerHTML = total;
}