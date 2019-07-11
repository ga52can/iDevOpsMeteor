/*
it('package.json has correct name', async () => {
  const { name } = await import('../package.json');
  assert.strictEqual(name, 'idevops');
});

if (Meteor.isClient) {
  it('client is not server', () => {
    assert.strictEqual(Meteor.isServer, false);
  });
}

if (Meteor.isServer) {
  it('server is not client', () => {
    assert.strictEqual(Meteor.isClient, false);
  });
*/

test('check Docker stats', async () => {
  const Docker = require('dockerode');
  const docker = new Docker({protocol: 'http', host: '131.159.30.137', port: 80 });
  //const docker = new Docker({protocol: 'http', host: '10.211.55.4', port: 2376 });
  //const docker = new Docker({socketPath: '/var/run/docker.sock'});
  //console.log(docker);
  const container = docker.getContainer('21c8f012ff47');
  console.log(container);
  const info = await container.inspect();
  console.log(info);
  //const stats = await container.stats({ stream: false });
  //console.log(stats);

});
