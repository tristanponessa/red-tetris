
export function shuffle(array) { 
    return array.sort(() => Math.random() - 0.5);
}

/*
function nestedObj (obj, nested) {
    /* obj === == obj will result in false as long as their refs are diff */
    /* this fn is too only check vals *//*
    let olen = Object.entries(nested).length;
    let nfound = 0;
    for (const [k,v] of Object.entries(obj)) {
        for (const [nk,nv] of Object.entries(nested)) {
            if (k === nk && v === nv)
                nfound++;
        }
    }
    return nfound === olen;
}*/


export function cmpObjEntries (obj, obj2) {
    /* obj === == obj will result in false as long as their refs are diff */
    /* this fn is to only check vals */
    let olen = Object.entries(obj).length;
    let nfound = 0;
    for (const [k,v] of Object.entries(obj)) {
        for (const [nk,nv] of Object.entries(obj2)) {
            if (k === nk && v === nv)
                nfound++;
        }
    }
    return nfound === olen;
}

export function ArrayIncludesObj(arr, val) {
    /* obj === == .includes() obj will result in false as long as their refs are diff */
    /* a = [{name:''}] a[0] === {name:''} FALSE*/
    /* this fn is too only check vals */
    for (const e of arr) {
        if (cmpObjEntries(e, val))
            return true;
    }
    return false;
}

