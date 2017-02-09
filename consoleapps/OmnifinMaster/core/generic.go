package core

type GenericMaster struct {
	GenericKey  string `json:"genericKey"`
	Code        string `json:"code"`
	ParentValue string `json:"parentValue"`
	Description string `json:"description"`
	Status      string `json:"status"`
	LastUpdate  string `json:"lastUpdate"`
}

/*
   USER_DESIGNATION
   SECURITY_TYPE
   REPAYMENT_MODE
   MARITAL_STATUS
   LOAN_TYPE
   LOAN_PURPOSE
   PROPERTY_TYPE
   CUST_CONSTITUTION
   GENDER_INDIVIDUAL
   CUST_CATEGORY
   EDU_DETAIL
   CUST_ACC_TYPE
   CAST_CATEGORY
   RELATION_TYPE
   ADDRESS_TYPE
   DESIGNATION
*/
type GenericCategory struct {
	UserDesignation  []GenericMaster
	SecurityType     []GenericMaster
	RepaymentMode    []GenericMaster
	MaritalStatus    []GenericMaster
	LoanType         []GenericMaster
	LoanPurpose      []GenericMaster
	PropertyType     []GenericMaster
	CustConstitution []GenericMaster
	GenderIndividual []GenericMaster
	CustCategory     []GenericMaster
	EduDetail        []GenericMaster
	CustAccType      []GenericMaster
	CastCategory     []GenericMaster
	RelationType     []GenericMaster
	AddressType      []GenericMaster
	Designation      []GenericMaster
}

func sortGenericCategory(data []GenericMaster) GenericCategory {
	var ret GenericCategory
	for _, val := range data {
		switch val.GenericKey {
		case "DESIGNATION":
			ret.Designation = append(ret.Designation, val)
		case "CUST_CONSTITUTION":
			ret.CustConstitution = append(ret.CustConstitution, val)
		}
	}

	return ret
}

func SaveGeneric(data DataResponse) error {
	cat := sortGenericCategory(data.GenericMasterList)

	err := SaveBorrowerConstitutionList(cat.CustConstitution)
	if err != nil {
		return err
	}

	err = SavePosition(cat.Designation)
	if err != nil {
		return err
	}

	return nil
}
