// import {isStringEmpty} from '@/utils/commentUtil';

var treeGetValue = function (tree,nodes,id) {
    var a = new Array();
    var node=nodes;
    var isfor=true;
    function b(tree){
        if(tree!=null&&tree.length!=0){
            tree.forEach(item => {
                if(!isfor){
                    return;
                }
                a.push(item[node]);
                if(item[node]==id){
                    isfor=false;
                    return;
                }
                if(item.children != null && item.children.length!=0){
                    b(item.children,a);
                }
                if(isfor){
                    a.pop();
                }
            })
        }

    }
    b(tree);
    return a;
}

export{
    treeGetValue
}
