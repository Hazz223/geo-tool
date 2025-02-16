import { AddFeatureCollectionDialog } from "components/dialogs/AddFeatureCollectionDialog";
import { Fragment, useState } from "react";

export const AddFeatureCollection: React.FC = () => {
  const [addFeatureCollectionDialog, setFeatureCollectionDialog] =
    useState<boolean>(false);
  return (
    <Fragment>
      <button
        style={{ width: "100%", marginTop: "8px" }}
        onClick={() => setFeatureCollectionDialog(true)}
      >
        Add feature collection
      </button>
      <AddFeatureCollectionDialog
        open={addFeatureCollectionDialog}
        onClose={() => setFeatureCollectionDialog(false)}
      />
    </Fragment>
  );
};
