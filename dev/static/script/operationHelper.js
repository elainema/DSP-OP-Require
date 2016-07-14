define(["template"],function(template){
	template.helper("handleStatus", function(statusId){
		switch (statusId) {
			case 1 :
				return "有效"
				break;
			case 2 :
				return "无效"
				break;
			case 3 :
				return "待审核"
				break;
			default:
				return "";
				break;
		}
	})
	template.helper("handleRoleId", function(roleId){
		switch (roleId) {
			case 0 :
				return "unknow"
				break;
			case 1 :
				return "customer"
				break;
			case 2 :
				return "admin"
				break;
			case 3 :
				return "pm_creative_approval"
				break;
			case 4 :
				return "pm_finance_operator"
				break;
			case 5 :
				return "pm_finance_approval"
				break;
			case 6 :
				return "AM"
				break;
			default:
				return "";
				break;
		}
	})
})