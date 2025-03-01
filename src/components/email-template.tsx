import * as React from 'react';

interface EmailTemplateProps {
  body: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  body,
}) => (
  <div>
    <p>{body}</p>
  </div>
);