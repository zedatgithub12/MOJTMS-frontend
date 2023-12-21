import React from 'react';

const LinkPreview = ({ title, description, image, url }) => {
    return (
        <div>
            <a href={url} target="_blank" rel="noopener noreferrer">
                <div>
                    {image && <img src={image} alt="Link Preview" />}
                    <h3>{title}</h3>
                    <p>{description}</p>
                </div>
            </a>
        </div>
    );
};

export default LinkPreview;
