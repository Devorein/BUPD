import { Request, Response } from 'express';
import { CasefileModel, CrimeCategoryModel, CriminalModel } from '../models';
import CasefileCriminalModel from '../models/CasefileCriminal';
import WeaponModel from '../models/CrimeWeapon';
import VictimController from '../models/Victim';
import {
	ApiResponse,
	CreateCasePayload,
	CreateCaseResponse,
	ICrimeCategory,
	ICrimeWeapon,
	ICriminal,
	IVictim,
	PoliceJwtPayload,
} from '../shared.types';
import { checkForFields, transformCriminalData } from '../utils';

const CasefileController = {
	async create(
		req: Request<any, any, CreateCasePayload>,
		res: Response<ApiResponse<CreateCaseResponse>>
	) {
		try {
			const payload = req.body;
			const nonExistentFields = checkForFields(payload, [
				'crime_categories',
				'location',
				'crime_time',
				'weapons',
			]);
			if (nonExistentFields.length !== 0) {
				res.json({
					status: 'error',
					message: `${nonExistentFields[0]} is required`,
				});
			} else {
				const jwtPayload = req.jwt_payload as PoliceJwtPayload;
				const createdCasefile = await CasefileModel.create({
					...payload,
					police_nid: jwtPayload.nid,
				});

				if (!createdCasefile) {
					res.json({
						status: 'error',
						message: "Couldn't create case file. Please try again.",
					});
				} else {
					// Extracting the criminal ids passed
					const existingCriminalIds: number[] = [];
					// We need to filter the criminals so that we only add the new criminals
					const newCriminalPayloads: { name: string; photo: string }[] = [];
					payload.criminals.forEach((criminal) => {
						if ('id' in criminal) {
							existingCriminalIds.push(criminal.id);
						} else {
							newCriminalPayloads.push(criminal);
						}
					});
					const criminalFindQueries: Promise<ICriminal>[] = [];

					// Getting all the criminals from the ids to make sure that they exist in the database
					// Alongside returning them
					existingCriminalIds.forEach((existingCriminalId) =>
						criminalFindQueries.push(
							new Promise((resolve, reject) => {
								CriminalModel.find({ id: existingCriminalId })
									.then((criminalData) => {
										if (!criminalData) {
											reject(Error("Criminal doesn't exist"));
										} else {
											resolve(transformCriminalData(criminalData[0]));
										}
									})
									.catch((err) => {
										reject(err.message);
									});
							})
						)
					);

					const existingCriminals = await Promise.all(criminalFindQueries);

					const weaponInsertQueryPromises: Promise<ICrimeWeapon>[] = payload.weapons.map((weapon) =>
						WeaponModel.create({
							name: weapon,
							case_no: createdCasefile.case_no,
						})
					);

					const crimeCategoryInsertQueryPromises: Promise<ICrimeCategory>[] =
						payload.crime_categories.map((weapon) =>
							CrimeCategoryModel.create({
								name: weapon,
								case_no: createdCasefile.case_no,
							})
						);

					const victimInsertQueryPromises: Promise<IVictim>[] = payload.victims.map((victim) =>
						VictimController.create({
							victim_name: victim,
							case_no: createdCasefile.case_no,
						})
					);

					const criminalInsertQueryPromises: Promise<ICriminal>[] = newCriminalPayloads.map(
						(newCriminalPayload) =>
							new Promise((resolve, reject) => {
								CriminalModel.create(newCriminalPayload)
									.then((newCriminalData) => resolve(newCriminalData))
									.catch((err) => reject(err.message));
							})
					);

					const crimeCategories = await Promise.all(crimeCategoryInsertQueryPromises);
					const weapons = await Promise.all(weaponInsertQueryPromises);
					const newCriminals = await Promise.all(criminalInsertQueryPromises);
					const associatedCriminals = newCriminals.concat(existingCriminals);
					const victims = await Promise.all(victimInsertQueryPromises);

					const caseFileCriminalInsertQueryPromises: Promise<any>[] = newCriminals.map(
						(newCriminal) =>
							CasefileCriminalModel.create({
								criminal_id: newCriminal.id,
								case_no: createdCasefile.case_no,
							})
					);

					await Promise.all(caseFileCriminalInsertQueryPromises);

					res.json({
						status: 'success',
						data: {
							...payload,
							case_no: createdCasefile.case_no,
							case_time: createdCasefile.case_time,
							crime_time: createdCasefile.crime_time,
							status: 'open',
							criminals: associatedCriminals,
							police: jwtPayload,
							crime_categories: crimeCategories,
							weapons,
							victims,
						},
					});
				}
			}
		} catch (_) {
			res.json({
				status: 'error',
				message: "Couldn't create case file. Please try again.",
			});
		}
	},
};

export default CasefileController;
