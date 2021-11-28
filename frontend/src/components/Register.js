import React from "react";

export function Register({ registerDomain }) {
  return (
    <div>
      <h4>Register .ETH Name</h4>
      <form
        onSubmit={(event) => {
          // This function just calls the transferTokens callback with the
          // form's data.
          event.preventDefault();
          registerDomain();
        }}
      >
        <div className="form-group">
          <input className="btn btn-primary" type="submit" value="Register" />
        </div>
      </form>
    </div>
  );
}
