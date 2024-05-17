import React from 'react';

const Form = () => {
    return (
        <form>
            {/* Example form field */}
            <label>
                Name:
                <input type="text" name="name" />
            </label>
            <input type="submit" value="Submit" />
        </form>
    );
};

export default Form;
