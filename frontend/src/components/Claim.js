import React from "react";

export function Claim({ claimTokens, toAddress }) {
  return (
    <div>
      <h4>Claim .ETH Name</h4>
      <form
        onSubmit={(event) => {
          // This function just calls the transferTokens callback with the
          // form's data.
          event.preventDefault();

          const formData = new FormData(event.target);
          const to = toAddress;
          const label = formData.get("label");

          if (to && label) {
            claimTokens(to, label);
          }
        }}
      >
        <div className="form-group">
          <input
            className="form-control"
            type="input"
            step="1"
            name="label"
            placeholder="domain-name.eth"
            required
          />
        </div>
        <div className="form-group">
          <input className="btn btn-primary" type="submit" value="Commit" />
        </div>
      </form>
    </div>
  );
}
