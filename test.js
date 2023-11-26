var admin = ['237671624397'];
function adminCheck(key){
        var state = 0; 
        admin.forEach((item)=>{
            if(key.participant.include(item)){
                state = 1;
            }
        });
        return state;
}