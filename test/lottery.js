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

    describe('security', async () => {
        it('get contracts balance', async () => {
            // adds 3 players
            await lottery.sendTransaction({ from: player, value: web3.utils.toWei('0.1', 'ether') });
            await lottery.sendTransaction({ from: player, value: web3.utils.toWei('0.1', 'ether') });
            await lottery.sendTransaction({ from: player, value: web3.utils.toWei('0.1', 'ether') });

            const balance = await lottery.getBalance({ from: deployer });
            assert.equal(balance, web3.utils.toWei('0.3', 'ether'));
        });

        it('fails to get contracts balance', async () => {
            let fails = false;
            await lottery.getBalance({ from: player })
                .catch((error) => {
                    fails = true;
                });
            assert.equal(fails, true);
        });
    });

    describe('entry', async () => {
        it('entries succefully', async () => {
            await lottery.sendTransaction({ from: player, value: web3.utils.toWei('0.1', 'ether') });

            let numberOfPlayers = await lottery.getPlayersLength();
            let newPlayer = await lottery.players(3);

            assert.equal(numberOfPlayers, 4); //ensure that there are no players after the player's entry
            assert.equal(newPlayer, player); //after entry, players array gets bigger
        });

        //TODO: write a test based on require error slug message
        it('sent invalid ether amount', async () => {
            let fails = false;
            await lottery.sendTransaction({ from: player, value: web3.utils.toWei('0.01', 'ether') })
                .catch((error) => {
                    fails = true;
                });
            assert.equal(fails, true);
        });
    })
})