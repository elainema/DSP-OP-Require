define(["template"],function(template){
	template.helper("handleStatus", function(id){
		switch (id) {
			case 1 :
				return "审核中"
				break;
			case 2 :
				return "审核通过"
				break;
			case 3 :
				return "审核未通过"
				break;
			case 4 :
				return "审核通过(部分)"
				break;
			default:
				return "";
				break;
		}
	})
	template.helper("handleAdType", function(id){
		switch (id) {
			case 1 :
				return "横幅"
				break;
			case 2 :
				return "原生"
				break;
			case 3 :
				return "视频"
				break;
			case 4 :
			default:
				return "";
				break;
		}
	})
	template.helper("countUnapprovedAdIds", function(id, status, unapprovedAdIds){
		if (status != 2) {
    		unapprovedAdIds.push(id);
		}
    	return unapprovedAdIds.join(",");
	})
})