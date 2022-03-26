const { assert } = require('chai');

const Lottery = artifacts.require('./Lottery.sol');

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Lottery', ([deployer, player]) => {
    let lottery;

    before(async () => {
        lottery = await Lottery.deployed();
    })

    describe('deployment', async () => {
        it('deploys successfully', async () => {
            const address = await lottery.address;
            assert.notEqual(address, 0x0);
            assert.notEqual(address, '');
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        })
    })

    describe('entry', async () => {
        it('entries succefully', async () => {
            let noPlayers = await lottery.getPlayersLength();

            await lottery.sendTransaction({ from: player, value: web3.utils.toWei('0.1', 'ether') });

            let newPlayer = await lottery.players(0);

            assert.equal(noPlayers, 0); //ensure that there are no players after the player's entry
            assert.equal(newPlayer, player); //after entry, players array gets bigger
        });

        // it('cant buy', async () => {
        //     await property.setPrice(5000000000);

        //     assert.equal(deployer, await property.owner()); //before buying, owner is its own deployer

        //     result = await property.buy({ from: buyer, value: web3.utils.toWei('0', 'GWei') })

        //     assert.equal(deployer, await property.owner()); //after buying, deployer stills the owner
        // });
    })
})