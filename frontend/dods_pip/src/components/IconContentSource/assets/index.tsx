import Blog from './blog.png';
import CommitteeRegions from './committee-of-the-regions.gif';
import Common from './common.png';
import CouncilEu from './council-of-the-eu.gif';
import CourtJusticeEu from './court-of-justice-of-the-eu.gif';
import Dods from './dods.gif';
import Efta from './efta.gif';
import EuStakeHolder from './eu_stakeholder.gif';
import EuAgencies from './eu-agencies-and-other-bodies.gif';
import EuAndNonEuBodies from './eu-and-non-eu-bodies.gif';
import EuropeanCentralBank from './european-central-bank.gif';
import EuropeanCommission from './european-commission.gif';
import EuropeanCouncil from './european-council.gif';
import EuropeanCourtAuditors from './european-court-of-auditors.gif';
import EuropeanEconomic from './european-economic-and-social-committee.gif';
import EuropeanExternal from './european-external-action-services.gif';
import EuParliament from './european-parliament.gif';
import EuParliamentAndCouncil from './european-parliament-and-council-of-the-eu.gif';
import Facebook from './facebook.png';
import Hm from './hm.gif';
import IeStakeHolder from './ie_stakeholder.gif';
import Ireland from './ireland.gif';
import IrelandEx from './ireland-ex.gif';
import Lords from './lords.gif';
import MemberStates from './member-states.gif';
import Na from './na.png';
import NonEuBodies from './non-eu-bodies.gif';
import Parliament from './parliament.png';
import Scott from './scott.gif';
import ScottGov from './scottGov.gif';
import ScottishStakeHolder from './scottish_stakeholder.gif';
import GreaterLondonAssembly from './the-greater-london-assembly.gif';
import Twitter from './twitter.png';
import UkStakeholder from './uk_stakeholder.gif';
import Wales from './wales.gif';
import Welsh from './welsh.gif';
import WelshStakeHolder from './welsh_stakeholder.gif';

export const Icons = {
  'House of Commons': Common,
  'House of Lords': Lords,
  'Northern Ireland Assembly': Ireland,
  'Northern Ireland Executive': IrelandEx,
  'UK Parliament': Parliament,
  'Scottish Parliament': Scott,
  'Scottish Government': ScottGov,
  'National Assembly for Wales': Wales,
  Dods,
  'HM Government': Hm,
  'Welsh Government': Welsh,
  'UK Stakeholder': UkStakeholder,
  'EU Stakeholder': EuStakeHolder,
  'Wales Stakeholder': WelshStakeHolder,
  'Northern Ireland Stakeholder': IeStakeHolder,
  'Scotland Stakeholder': ScottishStakeHolder,
  Twitter,
  Facebook,
  Blog,
  'National Archives': Na,
  'European Commission': EuropeanCommission,
  'European Council': EuropeanCouncil,
  'Council of the EU': CouncilEu,
  'European Parliament': EuParliament,
  'European Parliament and Council of the EU': EuParliamentAndCouncil,
  'Court of Justice of the EU': CourtJusticeEu,
  'European Court of Auditors': EuropeanCourtAuditors,
  'European Central Bank': EuropeanCentralBank,
  'EFTA Surveillance Authority': Efta,
  'European External Action Services': EuropeanExternal,
  'European Economic and Social Committee': EuropeanEconomic,
  'Committee of the Regions': CommitteeRegions,
  'Member States': MemberStates,
  'EU Agencies and Other Bodies': EuAgencies,
  'EU and Non EU Bodies': EuAndNonEuBodies,
  'Non EU Bodies': NonEuBodies,
  'Greater London Authority': GreaterLondonAssembly, // Todo: check this is correct
  'Local Government': UkStakeholder,
};

export type IconType = keyof typeof Icons;
