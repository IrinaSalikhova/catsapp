const e = require('express');
const db = require('../db'); 

const Asset = require('../model/Asset'); 
const AssetDraft = require('../model/AssetDraft'); 


describe('Asset Class (Database Integration Tests)', () => {
    let assetMaxId; 
    let assetMinId;
    let assetFromDraftId;
    let parentAssetId;
    let childAssetIds = [];
    let assetDraft;

    beforeAll(async () => {
        assetDraft = await AssetDraft.getById(1058);
       // console.log("assetDraft", assetDraft);
    });

    afterAll(async () => {
        const allIds = [assetMaxId, assetMinId, assetFromDraftId, ...childAssetIds, parentAssetId ];
        for (const id of allIds) {
            await db.query('DELETE FROM assetCategLinks WHERE assetId = ?', [id]);
            await db.query('DELETE FROM assets WHERE id = ?', [id]);   
        };
    });

    describe('Constructor', () => {
        test('should correctly initialize an Asset instance', () => {

            const asset = new Asset({
                data: {
                    id: 1,
                    name: 'Test Asset',
                    categoryIds: [1, 2]
                }
            });
            expect(asset).toBeInstanceOf(Asset);
            expect(asset.id).toBe(1);
            expect(asset.name).toBe('Test Asset');
            expect(asset.categoryIds).toEqual([1, 2]);
            expect(asset.isEnable).toBe(true);

        });

        test('should throw an error for invalid data', () => {
            expect(() => new Asset({ data: { name: '' } })).toThrow(Error);
        });
    });

    describe('formatUserData', () => {
        test('should format user data correctly', () => {
            const data = {
                id: 1,
                name: 'Test Asset',
                categoryIds: [1, 2],
                createdByFirstName: 'John',
                createdByLastName: 'Doe',
                createdByJobTitle: 'Manager',
                lastUpdateByFirstName: 'Jane',
                lastUpdateByLastName: 'Smith',
                lastUpdateByJobTitle: 'Director',
                isEnable: true
            };
            const formattedData = Asset.formatUserData(data);
            expect(formattedData.createdName).toBe('John Doe - Manager');
            expect(formattedData.lastUpdateName).toBe('Jane Smith - Director');
            expect(formattedData).not.toHaveProperty('createdByFirstName');
            expect(formattedData).not.toHaveProperty('createdByLastName');
            expect(formattedData).not.toHaveProperty('createdByJobTitle');
            expect(formattedData).not.toHaveProperty('lastUpdateByFirstName');
            expect(formattedData).not.toHaveProperty('lastUpdateByLastName');
            expect(formattedData).not.toHaveProperty('lastUpdateByJobTitle');
        });
    });

    describe('creations', () => {
        test('Should create and save an Asset correctly with max data', async () => {
            const data = {
                    hasChildren: false,
                    parentAssetId: null,
                    name: 'Max Data Asset',
                    description: 'An asset with maximum data.',
                    categoryIds: [10, 20],
                    isVolunOpp: true,
                    volunOppText: 'Volunteer opportunity available',

                    scheduleType: "damn field",
                    registrationNote: "Max Data Asset Registration Note",
                    scheduleNote: "Max Data Asset Schedule Note",
                    socialWorkerOnlyNote: "Max Data Asset socialWorkerOnlyNote",
                    isWheelchairAcc: true,
                    languagesOffered: ["English", "Spanish", "boolean"],
                    format: ["Online", "On site", "Group", "Individual", "Drop-in", "Scheduled event", "Self-paced"],
                    createdBy: 1112,
                    lastUpdateBy: 1112,

                    cityName: 'New York',
                    address: '123 Test St',
                    postCode: '10001',
                    longitude: -74.0060,
                    latitude: 40.7128,
                    transportation: "Night Knight",
                    phoneNumber: ["3456789876544567", "4567", ""],
                    email: ['test@example.com'],
                    website: ['https://example.com', 'tyuifuhdgj']

                };
            
            const asset = new Asset({ data });

            await asset.save(2);
            assetMaxId = asset.id;

            expect(asset.id).toBeDefined();

            const [rows] = await db.query('SELECT * FROM assets WHERE id = ?', [assetMaxId]);
            expect(rows.length).toBe(1);
            expect(rows[0].name).toBe(data.name);
            //console.log(rows[0]);
        });

        test('Should create and save an Asset correctly with min data', async () => {
            const data = {
                name: 'Min Data Asset',
                categoryIds: [11, 22],
            };
            const asset = new Asset({ data });

            await asset.save(2);
            assetMinId = asset.id;

            expect(asset.id).toBeDefined();

            const [rows] = await db.query('SELECT * FROM assets WHERE id = ?', [assetMinId]);
            expect(rows.length).toBe(1);
            expect(rows[0].name).toBe(data.name);
            //console.log(rows[0]);

        
        });

        test('Should create and save an Asset correctly from existing AssetDraft', async () => {
            
            const asset = new Asset({data: assetDraft});
            await asset.save(2);
            assetFromDraftId = asset.id;

            expect(asset.id).toBeDefined();

            const [rows] = await db.query('SELECT * FROM assets WHERE id = ?', [assetFromDraftId]);
            expect(rows.length).toBe(1);
            expect(rows[0].name).toBe(assetDraft.name);
            expect(rows[0].draftId).toBe(1058);
            //console.log(rows[0]);

        });

        test('Should create and save a multilevel Asset correctly', async () => {
            const assetDataArray = [
                {
                    name: 'Parent Asset',
                    categoryIds: [3],
                    description: 'A parent asset',
                    scheduleNote: 'Parent Asset Initial Schedule Note'

                },
                ...Array.from({ length: 3 }, (_, i) => ({
                    name: `Child Asset ${i + 1}`,
                    categoryIds: [3],
                    description: `Child ${i + 1} of Parent Asset`,
                    isVolunOpp: true,
                    isWheelchairAcc: true,
                    languagesOffered: ["English", "Spanish"],
                }))
            ];
        
            const hasChildren = assetDataArray.length > 1;
            const [parentAssetData, ...childrenData] = assetDataArray;
            parentAssetData.hasChildren = hasChildren;
            
            const parentAsset = new Asset({ data: parentAssetData });
            await parentAsset.save(2);
            parentAssetId = parentAsset.id;
        
            for (const childData of childrenData) {
                childData.parentAssetId = parentAssetId;
                childData.parentAssetName = parentAsset.name;
                
                let childAsset = new Asset({ data: childData });
                await childAsset.save(2);
                childAssetIds.push(childAsset.id);
            }

        });
    });

    describe('retrievals', () => {

        test('Should retrieve a Max Asset by ID', async () => {
            const retrievedMaxAsset = await Asset.getById(assetMaxId);
            expect(retrievedMaxAsset).not.toBeNull();
            //console.log(retrievedMaxAsset);
            expect(retrievedMaxAsset.name).toBe('Max Data Asset');
        });

        test('Should retrieve a Min Asset by ID', async () => {
            const retrievedMinAsset = await Asset.getById(assetMinId);
            expect(retrievedMinAsset).not.toBeNull();
            //console.log(retrievedMinAsset);
            expect(retrievedMinAsset.name).toBe('Min Data Asset');
        });

        test('Should retrieve an Asset from Draft by ID', async () => {
            const retrievedDraftedAsset = await Asset.getById(assetFromDraftId);
            expect(retrievedDraftedAsset).not.toBeNull();
            //console.log(retrievedDraftedAsset);
            expect(retrievedDraftedAsset.name).toBe('Rental at W.E. Gowling Public School');
        });

        test('Should retrieve a parent Asset by ID', async () => {
            const retrievedParentAssetOnly = await Asset.getById(parentAssetId);
            expect(retrievedParentAssetOnly).not.toBeNull();
            //console.log("retrievedParentAssetOnly", retrievedParentAssetOnly);
            expect(retrievedParentAssetOnly.name).toBe('Parent Asset');
            expect(retrievedParentAssetOnly.parentAssetId).toBeNull();
            expect(retrievedParentAssetOnly.childrenIds.length).toBe(3);
            expect(retrievedParentAssetOnly.childrenNames.length).toBe(3);
        });

        test('getParentWithChildren should return parent with all children', async () => {
            const retrievedParentAssetTree = await Asset.getParentWithChildren(parentAssetId);
            expect(retrievedParentAssetTree).not.toBeNull();
           //console.log("retrievedParentAssetTree", retrievedParentAssetTree);
            expect(retrievedParentAssetTree.name).toBe('Parent Asset');
            expect(retrievedParentAssetTree.children.length).toBe(3);
            expect(retrievedParentAssetTree.children[0].name).toBe('Child Asset 1');
            expect(retrievedParentAssetTree.children[1].name).toBe('Child Asset 2');
            expect(retrievedParentAssetTree.children[2].name).toBe('Child Asset 3');
            expect(retrievedParentAssetTree.children[0].id).toBe(childAssetIds[0]);
            expect(retrievedParentAssetTree.children[1].id).toBe(childAssetIds[1]);
            expect(retrievedParentAssetTree.children[2].id).toBe(childAssetIds[2]);

        });

        test('Should retrieve all enabled assets', async () => { 
            const assets = await Asset.getAllEnabledAssets();
            expect(assets.length).toBeGreaterThan(0);
            //console.log(assets);

        });
    });
        describe('disableAsset', () => {
            test('Should disable an Asset by ID', async () => {
                const assetToDisable = await Asset.getById(assetMaxId);
                await assetToDisable.disableAsset();
                const retrievedDisabledAsset = await Asset.getById(assetMaxId);
                expect(retrievedDisabledAsset).not.toBeNull();
                expect(retrievedDisabledAsset.isEnable).toBe(false);
                //console.log(retrievedDisabledAsset);
            });

            test('Should disable child and show parent correctly', async () => {
                const assetToDisable = await Asset.getById(childAssetIds[0]);
                await assetToDisable.disableAsset();
                const retrievedParentAssetOnly = await Asset.getById(parentAssetId);
                expect(retrievedParentAssetOnly).not.toBeNull();
                //console.log(retrievedParentAssetOnly);
                expect(retrievedParentAssetOnly.name).toBe('Parent Asset');
                expect(retrievedParentAssetOnly.parentAssetId).toBeNull();
                expect(retrievedParentAssetOnly.childrenIds.length).toBe(2);
                expect(retrievedParentAssetOnly.childrenNames.length).toBe(2);

            });

            test('Should disable parent with all children', async () => {
                const assetToDisable = await Asset.getById(parentAssetId);
                await assetToDisable.disableAsset();
                const retrievedParentAssetTree = await Asset.getParentWithChildren(parentAssetId);
                expect(retrievedParentAssetTree).not.toBeNull();
                //console.log(retrievedParentAssetTree);
                expect(retrievedParentAssetTree.name).toBe('Parent Asset');
                expect(retrievedParentAssetTree.children.length).toBe(3);
                expect(retrievedParentAssetTree.isEnable).toBe(false);
                expect(retrievedParentAssetTree.children[0].isEnable).toBe(false);
                expect(retrievedParentAssetTree.children[1].isEnable).toBe(false);
                expect(retrievedParentAssetTree.children[2].isEnable).toBe(false);

            });
        }); 

        describe('editAsset', () => {
            test('Should edit a standalone Asset', async () => {
                const updateData = {
                    name: 'Updated Asset',
                    categoryIds: [3, 8, 23],
                    description: 'Updated description',
                    isVolunOpp: true,
                    volunOppText: 'New volunteer text',
                    scheduleType: 'Flexible',
                    registrationNote: 'Updated note',
                    cityName: 'Los Angeles',
                    address: '456 Another St',
                    postCode: '90001',
                    longitude: -118.2437,
                    latitude: 34.0522,
                    transportation: 'Bus',
                    phoneNumber: ['9876543210'],
                    email: ['updated@example.com'],
                    website: ['https://updated.com'],
                };
                const assetToEdit = await Asset.getById(assetMaxId);
                await assetToEdit.editAsset(updateData, 5);
                const editedAsset = await Asset.getById(assetMaxId);
                expect(editedAsset).not.toBeNull();
                expect(editedAsset.isEnable).toBe(true);
                expect(editedAsset.name).toBe('Updated Asset');
                expect(editedAsset.categoryIds).toEqual([3, 8, 23]);

                
                //console.log(editedAsset);

            });

            test('Should edit a parent asset with kids', async () => {
                const updateParentData = {
                    name: 'Updated Parent Asset',
                    categoryIds: [3, 8, 23],
                    description: 'Updated description',
                    isVolunOpp: true,
                    volunOppText: 'New volunteer text',
                    scheduleType: 'Flexible',
                    registrationNote: 'Updated note',
                    cityName: 'Los Angeles',
                    address: '456 Another St',
                    postCode: '90001',
                    longitude: -118.2437,
                    latitude: 34.0522,
                    transportation: 'Bus',
                    phoneNumber: ['9876543210'],
                    email: ['updated@example.com'],
                    website: ['https://updated.com'],
                };
                const updateChildData = {name: 'Updated Child Asset', categoryIds: [1, 11, 22]};
                const assetToEdit = await Asset.getById(parentAssetId);
                await assetToEdit.editAsset(updateParentData, 5);

                updateChildData.parentAssetId = parentAssetId; 

                for (const childId of childAssetIds) {
                    const childAssettoEdit = await Asset.getById(childId);
                    await childAssettoEdit.editAsset(updateChildData, 5);
                    //console.log(childAssettoEdit);
                }
                const retrievedParentAssetTree = await Asset.getParentWithChildren(parentAssetId);
                expect(retrievedParentAssetTree).not.toBeNull();
                expect(retrievedParentAssetTree.hasChildren).toBe(true);
                //console.log(retrievedParentAssetTree);
                expect(retrievedParentAssetTree.name).toBe('Updated Parent Asset');
                expect(retrievedParentAssetTree.children.length).toBe(3);
                expect(retrievedParentAssetTree.isEnable).toBe(true);
                expect(retrievedParentAssetTree.children[0].isEnable).toBe(true);
                expect(retrievedParentAssetTree.children[1].isEnable).toBe(true);
                expect(retrievedParentAssetTree.children[2].isEnable).toBe(true);
                expect(retrievedParentAssetTree.children[0].isVolunOpp).toBe(true);
                expect(retrievedParentAssetTree.children[0].isWheelchairAcc).toBe(true);

            });
        });

        describe('searchAssets', () => {
            test('Should search for assets and filter them correctly', async () => {
                const results = await Asset.searchAssets({ 
                    categoryIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],  
                    searchPhrase: "accessible school" 
                });
                console.log(results);
                expect(results.length).toBeGreaterThan(0);
                expect(results[0].name).toBe('Rental at W.E. Gowling Public School');
                const isAccessible = results[0].categoryIds.includes(29) || results[0].isWheelchairAcc === true;
                expect(isAccessible).toBe(true);

            });


            test('Should filter assets correctly', async () => {
                const results = await Asset.searchAssets({ 
                    categoryIds: [1, 3],
                    isVolunOpp: true, 
                });
                //console.log(results);
                expect(results.length).toBeGreaterThan(0);
                for (const result of results) {
                    expect(result.isVolunOpp).toBe(true);
                    const isTrue = result.categoryIds.includes(1) || result.categoryIds.includes(3)
                    expect(isTrue).toBe(true); 
                }
        });
    });

    });
