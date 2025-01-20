/* eslint-disable max-len */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { desicionEpidemicRequest, desicionInterventionsRequest } from "../../store/actions.js";
import Filter from "./filter";
import { initialFormTable } from "../../Constants";
// import PreviewTable from "./previewTable";
import GlobalLoader from "../../components/Common/GLobalLoader.js";
import Table from "./table.js";

function DecisionSupportComponent() {
  const dispatch = useDispatch();
  const [phaseList, setPhaseList] = useState([]);
  const [formData, setFormData] = useState({});
  const [submitForm, setSubmitForm] = useState(false);
  const updateFormData = (newData) => {
    setFormData(newData);
  };

  const nextprops = useSelector((state) => ({
    ListEpidemic: state.Decision.EpidemicList,
    Intervention: state.Decision.interventionData,
    LoadingTableData: state.Decision.interventionLoading,
  }));
  useEffect(() => {
    dispatch(desicionEpidemicRequest());
  }, []);
  useEffect(() => {
    if (submitForm === false && initialFormTable) {
      dispatch(desicionInterventionsRequest(initialFormTable));
    }
  }, [initialFormTable, formData]);
  useEffect(() => {
    if (submitForm && formData) {
      dispatch(desicionInterventionsRequest(formData));
    }
  }, [formData]);

  useEffect(() => {
    if (nextprops?.ListEpidemic) {
      setPhaseList(nextprops?.ListEpidemic);
    }
  }, [nextprops?.ListEpidemic]);

  return (
    <>
      <GlobalLoader loader={nextprops.LoadingTableData} />
      <div className="main-container">
        <Filter
          phaseList={phaseList}
          updateFormData={updateFormData}
          setSubmitForm={setSubmitForm}
        />
        <div className="table-container">
          {formData?.phaseName ? (
            <h6 className="table-title">Interventions during - {formData?.phaseName}</h6>
          ) : (
            <h6 className="table-title">Interventions during - {initialFormTable?.phaseName}</h6>
          )}
          <Table data={nextprops?.Intervention} loader={nextprops.LoadingTableData} />
        </div>
      </div>
    </>
  );
}
export default DecisionSupportComponent;
