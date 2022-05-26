import React from 'react';
import Layout from '../components/Layout';
import CircleLayout from '../components/CircleLayout';
const NotFoundPage = () => (
  <Layout>
    <CircleLayout>
      <div className="circle-text flex-center flex-container__column">
        Hmmm, there's nothing here :(
      </div>
    </CircleLayout>
  </Layout>
);

export default NotFoundPage;
